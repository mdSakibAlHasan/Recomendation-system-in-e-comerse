from django.urls import path
from .views import CategoryApi, BrandApi, GetCommentsByProductId, ProductApi, GetProductById
from . import views

urlpatterns = [
    path('category',CategoryApi.as_view()),
    path('brand',BrandApi.as_view()),
    path('product/',ProductApi.as_view(), name='product-api'),
    path('product/<int:id>/',GetProductById.as_view()),
    path('<int:product_id>/comments/',GetCommentsByProductId.as_view()),
]