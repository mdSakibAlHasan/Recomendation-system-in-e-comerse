from rest_framework import serializers
from .models import Category, Brand, Product, ProductComment

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

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model=ProductComment
        exclude = []
        depth = 1
    def create(self, validated_data):
        print (validated_data)
        return ProductComment.objects.create(**validated_data)