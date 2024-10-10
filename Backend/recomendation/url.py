from django.urls import path
from .views import LikeStatus

urlpatterns = [
    path('likeStatus/<int:product_id>',LikeStatus.as_view()),
]