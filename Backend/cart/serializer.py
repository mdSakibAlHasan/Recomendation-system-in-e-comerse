from rest_framework import serializers
from .models import Cart

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        exclude = []


class GetCartSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cart
        exclude = ['UID']
        depth = 1