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
        depth = 1

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='UID.username', read_only=True)
    class Meta:
        model=ProductComment
        fields = ['PID', 'UID', 'comment', 'review', 'create_time', 'username']
    # def create(self, validated_data):
    #     print (self,validated_data)
    #     return ProductComment.objects.create(**validated_data)