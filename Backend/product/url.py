from django.urls import path
from .views import CategoryApi, BrandApi, GetCommentsByProductId, ProductApi, GetProductById, ProductManagement, CategoryDetailApi, BrandApiCreate

urlpatterns = [
    path('category',CategoryApi.as_view()),
    path('category/<int:pk>',CategoryDetailApi.as_view()),
    path('brand/<int:id>',BrandApi.as_view()),
    path('addBrand/<int:id>',BrandApiCreate.as_view()),
    path('product/',ProductApi.as_view(), name='product-api'),
    path('product/<int:id>/',GetProductById.as_view()),
    path('<int:product_id>/comments/',GetCommentsByProductId.as_view()),
    path('productManagement',ProductManagement.as_view()),
]