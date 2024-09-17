from django.urls import path
from .views import CartProduct, CartItemCountView, GetOrderHistory

urlpatterns = [
    path('',CartProduct.as_view()),
    path('count',CartItemCountView.as_view()),
    path('orderHistory',GetOrderHistory.as_view())
]