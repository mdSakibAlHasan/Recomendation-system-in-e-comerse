from django.urls import path
from .views import LikeStatus, getRecommendation

urlpatterns = [
    path('likeStatus/<int:product_id>',LikeStatus.as_view()),
    path('recommendations',getRecommendation.as_view())
]