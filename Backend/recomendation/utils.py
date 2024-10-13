from rest_framework.response import Response
from rest_framework import status
from product.models import Product

def recommendation_for_visitors():
    recommendation_products = Product.objects.order_by(
        '-item_puchases',   
        '-like',            
        '-average_rating', 
        '-item_view',      
        'disLike'           
    )
    return recommendation_products

def recommendation_for_user():
    return Response({"message": "User not found"}, status=status.HTTP_403_FORBIDDEN)