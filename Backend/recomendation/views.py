from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Backend.utils import getUserId
from .models import LikedProduct
from .serializer import LikedSerilizer
   

class LikeStatus(APIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        product_id = self.kwargs['product_id']
        
        if user_id is None:
            return Response({"message": "User not found"}, status=status.HTTP_403_FORBIDDEN)
        
        liked_product = LikedProduct.objects.filter(UID=user_id, PID=product_id)
        
        if liked_product.exists():
            serializer = LikedSerilizer(liked_product, many=True)  
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)

            
    
    def post(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')  
        user_id = getUserId(request) 
        preference = request.data.get('preference') 

        if user_id is None or preference is None:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        liked_product, created = LikedProduct.objects.get_or_create(
            PID_id=product_id,
            UID_id=user_id,
            defaults={'preference': preference}  
        )

        if not created: 
            liked_product.preference = preference
            liked_product.save()

        serializer = LikedSerilizer(liked_product)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


    def delete(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id') 
        user_id = getUserId(request)  

        if user_id is None:
            return Response({"error": "User not found"}, status=status.HTTP_403_FORBIDDEN)

        try:
            liked_product = LikedProduct.objects.get(PID_id=product_id, UID_id=user_id)
            liked_product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  # Successfully deleted
        except LikedProduct.DoesNotExist:
            return Response({'detail': 'Liked product not found.'}, status=status.HTTP_404_NOT_FOUND)

