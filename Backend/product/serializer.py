from rest_framework import serializers
from .models import Category, Brand, Product

class CategorySerilizer(serializers.ModelSerializer):
    class Meta:
        model = Category
        exclude = []

class BrandSerilizer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        exclude = []

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        exclude = [] 