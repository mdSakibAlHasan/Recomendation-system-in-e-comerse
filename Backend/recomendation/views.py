import random
from random import shuffle
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.generics import ListAPIView
from Backend.utils import getUserId
from product.filters import ProductFilter
from product.models import Product
from .models import LikedProduct, SearchActivity
from .serializer import LikedSerilizer
from product.pagination import DefaultPagination
from product.serializer import ProductSerializer
from .utils import recommendation_for_user, recommendation_for_visitors, save_clusters_to_db, get_similar_products,get_similar_products_for_multiple_ids
   

class LikeStatus(APIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        product_id = self.kwargs['product_id']
        
        if user_id is None:
            return Response({"message": "User not found"}, status=status.HTTP_403_FORBIDDEN)
        
        liked_product = LikedProduct.objects.filter(UID=user_id, PID=product_id)
        
        if liked_product.exists():
            serializer = LikedSerilizer(liked_product, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)

            
    
    def post(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')  
        user_id = getUserId(request) 
        preference = request.data.get('preference') 

        if user_id is None or preference is None:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        liked_product, created = LikedProduct.objects.get_or_create(
            PID_id=product_id,
            UID_id=user_id,
            defaults={'preference': preference}  
        )

        if not created: 
            liked_product.preference = preference
            liked_product.save()

        serializer = LikedSerilizer(liked_product)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


    def delete(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id') 
        user_id = getUserId(request)  

        if user_id is None:
            return Response({"error": "User not found"}, status=status.HTTP_403_FORBIDDEN)

        try:
            liked_product = LikedProduct.objects.get(PID_id=product_id, UID_id=user_id)
            liked_product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  # Successfully deleted
        except LikedProduct.DoesNotExist:
            return Response({'detail': 'Liked product not found.'}, status=status.HTTP_404_NOT_FOUND)


class getRecommendation(ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = DefaultPagination
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'model']
    ordering_fields = ['price', 'average_rating', 'like', 'item_purchases']

    def get_queryset(self):
        user_id = getUserId(self.request)
        search_query = self.request.query_params.get('search', None)
        if search_query:
            self.log_search_activity(user_id, search_query)

        if user_id is None:
            return recommendation_for_visitors()
        else:
            user_recommendations = recommendation_for_user(user_id)
            if user_recommendations.count()==0:
                return recommendation_for_visitors()
            else:
                similar_products = get_similar_products_for_multiple_ids(user_recommendations)
                final_recommendations = list(user_recommendations) + list(similar_products)
                return Product.objects.filter(id__in=[product.id for product in final_recommendations])

    def log_search_activity(self, user_id, search_query):        # Save search activity in the database
        SearchActivity.objects.create(
            UID_id=user_id,
            keyword=search_query,
        )

    def get_serializer_context(self):
        return {'request': self.request}


class clusterRecommendation(ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = DefaultPagination

    def get_queryset(self):
        product_id = self.kwargs['product_id']
        queryset = list(get_similar_products(product_id))  # Convert to list for shuffling
        # random.shuffle(queryset)  # Shuffle the queryset
        return queryset
    
    def post(self, request, product_id):
        save_clusters_to_db()
        return Response('Successfull KNN algorith apply', status=status.HTTP_200_OK)



from rest_framework.generics import ListAPIView
# from rest_framework.pagination import DefaultPagination
from rest_framework.response import Response
# from .serializer import ProductSerializer
from django.db.models import F, ExpressionWrapper, FloatField, Count


class TrendingProducts(ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = DefaultPagination

    def get_queryset(self):
        # Define weights for each metric
        weight_likes = 0.1
        weight_views = 0.2
        weight_orders = 0.3
        weight_cart = 0.4

        # Use database annotations to compute the trending score dynamically
        queryset = Product.objects.annotate(
            cart_count=Count('cart', filter=F('cart__status') == 'P'),  # Count carts with 'P' status
            total_score=ExpressionWrapper(
                (F('like') * weight_likes) +
                (F('item_view') * weight_views) +
                (F('item_puchases') * weight_orders) +
                (F('cart_count') * weight_cart),
                output_field=FloatField()
            )
        ).order_by('-total_score')[:10]

        return queryset


class StockOutProducts(ListAPIView):
    serializer_class = ProductSerializer
    pagination_class = DefaultPagination

    def get_queryset(self):
        # Fetch the 'stock_items' parameter from the URL
        stock_items = self.kwargs.get('stock_items', 0)
        # Filter products based on the stock_items value
        queryset = Product.objects.filter(stock_items__lte=stock_items)
        return queryset

class MostSoldProducts(ListAPIView):
    serializer_class = ProductSerializer
    # pagination_class = DefaultPagination

    def get_queryset(self):
        # Fetch products sorted by item_purchases in descending order
        queryset = Product.objects.order_by('-item_puchases')[:10]
        return queryset

class MostViewedProducts(ListAPIView):
    serializer_class = ProductSerializer
    # pagination_class = DefaultPagination

    def get_queryset(self):
        # Fetch products sorted by item_view in descending order
        queryset = Product.objects.order_by('-item_view')[:10]
        return queryset

class MostLikedProducts(ListAPIView):
    serializer_class = ProductSerializer
    # pagination_class = DefaultPagination

    def get_queryset(self):
        # Fetch products sorted by likes in descending order
        queryset = Product.objects.order_by('-like')[:10]
        return queryset

class DiscountRecommendation(ListAPIView):
    serializer_class = ProductSerializer
    # pagination_class = DefaultPagination

    def get_queryset(self):
        # Fetch products with low sales and high views (example logic for needing discounts)
        queryset = Product.objects.filter(item_puchases__lt=5, item_view__gt=50).order_by('-item_view')[:10]
        return queryset
