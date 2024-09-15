from django.urls import path
from .views import CartProduct

urlpatterns = [
    path('cart',CartProduct.as_view())
]