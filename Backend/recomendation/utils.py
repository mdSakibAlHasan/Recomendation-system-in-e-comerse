from rest_framework.response import Response
from rest_framework import status
from product.models import Product
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
    matrix = build_preference_matrix(user)
    
    # Sort products by preference degree (custom logic)
    sorted_products = sorted(matrix.items(), key=lambda x: sum(x[1].values()), reverse=True)

    return [product for product, _ in sorted_products]


def build_preference_matrix(user):
    # Initialize dictionary to store preference scores
    preference_matrix = defaultdict(lambda: {'like': 0, 'dislike': 0, 'purchase': 0, 'rate': 0, 'view': 0})

    # Get actions related to the user
    likes = LikedProduct.objects.filter(UID=user)
    views = ViewActivity.objects.filter(UID=user)
    # Similarly fetch other activities (purchases, ratings)

    total_actions = len(likes) + len(views)  # Sum all action types

    for like in likes:
        preference_matrix[like.PID]['like'] += 1

    for view in views:
        preference_matrix[view.PID]['view'] += view.times_vist

    # Add similar logic for purchases, rates, etc.

    # Calculate preference degree for each product
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

    # Recalculate the preference degree
    total_actions = sum(matrix[product].values())
    for action, count in matrix[product].items():
        matrix[product][action] = compute_preference_degree(count, total_actions)

    return matrix

