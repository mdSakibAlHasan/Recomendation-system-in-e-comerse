from rest_framework import serializers
from .models import LikedProduct

class LikedSerilizer(serializers.ModelSerializer):
    class Meta:
        model = LikedProduct
        exclude = []
