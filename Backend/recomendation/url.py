from django.urls import path
from .views import LikeStatus, getRecommendation, clusterRecommendation, trending_products

urlpatterns = [
    path('likeStatus/<int:product_id>',LikeStatus.as_view()),
    path('recommendations',getRecommendation.as_view()),
    path('getSimilarRecomendation/<int:product_id>',clusterRecommendation.as_view()),
    path('trending', trending_products, name='trending-products'),
]