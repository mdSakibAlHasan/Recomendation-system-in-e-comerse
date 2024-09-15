from django.urls import path
from .views import CartProduct, CartItemCountView

urlpatterns = [
    path('',CartProduct.as_view()),
    path('count',CartItemCountView.as_view())
]