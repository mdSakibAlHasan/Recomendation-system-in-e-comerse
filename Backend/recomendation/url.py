from django.urls import path
from .views import LikeStatus, StockOutProducts, TrendingProducts, getRecommendation, clusterRecommendation

urlpatterns = [
    path('likeStatus/<int:product_id>',LikeStatus.as_view()),
    path('recommendations',getRecommendation.as_view()),
    path('getSimilarRecomendation/<int:product_id>',clusterRecommendation.as_view()),
    path('trending', TrendingProducts.as_view()),
    path('stockout/<int:stock_items>',StockOutProducts.as_view()),
]