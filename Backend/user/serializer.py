from rest_framework import serializers
from .models import User

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = []

class UserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        exclude = ['password']