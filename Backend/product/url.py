from django.urls import path
from .views import CategoryApi, BrandApi, ProductApi
from . import views

urlpatterns = [
    path('category',CategoryApi.as_view()),
    path('brand',BrandApi.as_view()),
    path('product',ProductApi.as_view()),
]