from rest_framework.response import Response
from rest_framework import status
from product.models import Product

def recommendation_for_visitors():
    recommended_products = Product.objects.order_by(
        '-item_puchases',   # Purchases descending
        '-like',            # Likes descending
        '-average_rating',  # Ratings descending
        '-item_view',       # Views descending
        'disLike'           # Dislikes ascending
    )
    return recommended_products

def recommendation_for_user():
    return Response({"message": "User not found"}, status=status.HTTP_403_FORBIDDEN)