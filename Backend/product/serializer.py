from rest_framework import serializers
from django.db.models import Avg
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
    average_review = serializers.SerializerMethodField()
    class Meta:
        model = Product
        exclude = [] 
        depth = 1
        
    def get_average_review(self, obj):
        # Calculate the average review from the ProductComment model for the given product
        avg_review = ProductComment.objects.filter(PID=obj).aggregate(Avg('review'))['review__avg']
        # Return the average review or 0 if there are no reviews
        return avg_review if avg_review is not None else 0

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='UID.username', read_only=True)
    class Meta:
        model=ProductComment
        fields = ['PID', 'UID', 'comment', 'review', 'create_time', 'username']
    # def create(self, validated_data):
    #     print (self,validated_data)
    #     return ProductComment.objects.create(**validated_data)