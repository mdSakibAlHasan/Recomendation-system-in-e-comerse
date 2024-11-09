from django.db.models import Q
from rest_framework.response import Response
from product.models import Product, ProductComment
from cart.models import Cart
from collections import defaultdict
import math

from recomendation.models import LikedProduct, ViewActivity

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import random
import pandas as pd

def build_content_similarity():
    all_products = Product.objects.all()
    product_data = pd.DataFrame(list(all_products.values('id', 'description')))
    
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(product_data['description'])

    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    product_indices = pd.Series(product_data.index, index=product_data['id']).to_dict()
    return cosine_sim, product_indices, all_products

cosine_sim, product_indices, all_products = build_content_similarity()

def get_content_based_recommendations(product_id, num_recommendations=5):
    idx = product_indices[product_id]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:num_recommendations+1]
    
    similar_products_ids = [all_products[i[0]].id for i in sim_scores]
    return Product.objects.filter(id__in=similar_products_ids)

def recommendation_for_visitors():
    recommendation_products = Product.objects.order_by(
        '-item_puchases',   
        '-like',            
        '-average_rating', 
        '-item_view',      
        'disLike'
    )

    return recommendation_products

def recommendation_for_user(user):
    matrix = build_preference_matrix(user)
    sorted_products_ids = [product.id for product, actions in matrix.items() if actions['dislike'] == 0]
    return Product.objects.filter(id__in=sorted_products_ids)




def build_preference_matrix(user):
    preference_matrix = defaultdict(lambda: {'like': 0, 'dislike': 0, 'purchase': 0, 'rate': 0, 'view': 0})
    likes = LikedProduct.objects.filter(UID=user, preference=1).values_list('PID', flat=True)
    cart_add = Cart.objects.filter(UID = user).exclude(status=Cart.ORDERED).values_list('PID', flat=True)
    liked_product = Product.objects.filter(
        Q(id__in = likes) | Q(id__in=cart_add)
    ).distinct()
    dislikes = LikedProduct.objects.filter(UID=user, preference=2)
    views = ViewActivity.objects.filter(UID=user)
    purchases = Cart.objects.filter(UID=user,status=Cart.ORDERED)
    rates = ProductComment.objects.filter(UID = user,review__gt=2)
    total_actions = len(liked_product) + len(views)  + len(dislikes) + len(purchases) + len(rates)

    for like in liked_product:
        preference_matrix[like]['like'] += 1
    for view in views:
        preference_matrix[view.PID]['view'] += view.times_vist
    for purchase in purchases:
        preference_matrix[purchase.PID]['purchase'] += purchase.quantity
    for rate in rates:
        preference_matrix[rate.PID]['rate'] += 1

    for product, actions in preference_matrix.items():
        for action, count in actions.items():
            preference_matrix[product][action] = compute_preference_degree(count, total_actions)

    return preference_matrix



def compute_preference_degree(action_count, total_actions):
    return 2 * math.atan(action_count / total_actions)


def update_preference_matrix(user, product, action_type):
    matrix = build_preference_matrix(user)

    if product in matrix:
        matrix[product][action_type] += 1
    else:
        matrix[product][action_type] = 1

    total_actions = sum(matrix[product].values())
    for action, count in matrix[product].items():
        matrix[product][action] = compute_preference_degree(count, total_actions)

    return matrix


#Apply KNN algorithm

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.cluster import KMeans
from .models import Product

def get_product_text_data():
    products = Product.objects.all().values('id', 'name', 'description')
    product_df = pd.DataFrame(products)
    product_df['description'] = product_df['description'].fillna('')

    return product_df

def vectorize_text_data(product_df):
    tfidf = TfidfVectorizer(stop_words='english', max_features=500)     #Tuin here
    text_matrix = tfidf.fit_transform(product_df['description'])

    return text_matrix, product_df


def cluster_products(text_matrix, num_clusters=20):
    kmeans = KMeans(n_clusters=num_clusters, random_state=0)
    product_clusters = kmeans.fit_predict(text_matrix)
    
    return product_clusters

def save_clusters_to_db():
    product_df = get_product_text_data()
    text_matrix, product_df = vectorize_text_data(product_df)
    product_df['cluster'] = cluster_products(text_matrix)
    
    for _, row in product_df.iterrows():
        product = Product.objects.get(id=row['id'])
        product.cluster = row['cluster']
        product.save()

def get_similar_products(product_id):
    # Get products in the same cluster without limiting the number of recommendations
    product = Product.objects.get(id=product_id)
    cluster_id = product.cluster
    similar_products = Product.objects.filter(cluster=cluster_id).exclude(id=product_id)
    return similar_products

def get_similar_products_for_multiple_ids(user_recommendations):
    similar_products = Product.objects.none()
    
    for product in user_recommendations:
        cluster_id = product.cluster  
        similar_products |= Product.objects.filter(cluster=cluster_id).exclude(id=product.id)

    return similar_products.distinct()