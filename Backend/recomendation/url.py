from django.urls import path
from .views import LikeStatus, getRecommendation, clusterRecommendation

urlpatterns = [
    path('likeStatus/<int:product_id>',LikeStatus.as_view()),
    path('recommendations',getRecommendation.as_view()),
    path('getSimilarRecomendation/<int:product_id>',clusterRecommendation.as_view())
]