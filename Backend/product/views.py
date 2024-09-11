from rest_framework.generics import ListAPIView
from .models import Category, Brand, Product
from .serializer import CategorySerilizer, BrandSerilizer, ProductSerializer

class CategoryApi(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerilizer

class BrandApi(ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerilizer

class ProductApi(ListAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
