from django.urls import path
from .views import CartProduct, CartItemCountView, GetOrderHistory, IsInCart, MerchantInsightsView

urlpatterns = [
    path('',CartProduct.as_view()),
    path('count',CartItemCountView.as_view()),
    path('orderHistory',GetOrderHistory.as_view()),
    path('viewCart/<int:product_id>',IsInCart.as_view()),
    path('merchant',MerchantInsightsView.as_view())
]