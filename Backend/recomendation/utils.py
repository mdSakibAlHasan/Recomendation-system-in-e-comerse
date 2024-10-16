from django.db.models import Q
from rest_framework.response import Response
from product.models import Product, ProductComment
from cart.models import Cart
from collections import defaultdict
import math

from recomendation.models import LikedProduct, ViewActivity

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
    all_products = Product.objects.all()
    matrix = build_preference_matrix(user)
    actioned_products = matrix.keys()
    products_with_no_actions = all_products.exclude(id__in=[product.id for product in actioned_products])
    sorted_products_ids = [product.id for product, actions in matrix.items() if actions['dislike'] == 0]
    sorted_products_queryset = Product.objects.filter(id__in=sorted_products_ids)
    return sorted_products_queryset | products_with_no_actions




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

