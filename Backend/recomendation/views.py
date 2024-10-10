from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Backend.utils import getUserId
from .models import LikedProduct
from .serializer import LikedSerilizer

# class CartProduct(CreateAPIView):
#     def post(self, request, *args, **kwargs):
#         user_id = getUserId(request)
#         if user_id == None:
#             return Response({}, status=status.HTTP_403_FORBIDDEN)
#         else:
#             request.data['UID'] = user_id
#             serializer = CartSerializer(data=request.data)
#             if serializer.is_valid():
#                 serializer.save()
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
                
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class LikeStatus(APIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        product_id = self.kwargs['product_id']
        
        if user_id is None:
            return Response({"message": "User not found"}, status=status.HTTP_403_FORBIDDEN)
        
        liked_product = LikedProduct.objects.filter(UID=user_id, PID=product_id)
        
        if liked_product.exists():
            serializer = LikedSerilizer(liked_product, many=True)  # Serialize the queryset
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_404_NOT_FOUND)

            
    
    def post(self, request, *args, **kwargs):
    # Retrieve product_id from URL kwargs
        product_id = self.kwargs.get('product_id')  
        user_id = getUserId(request)  # Assuming this retrieves the user's ID
        preference = request.data.get('preference')  # Fetch the preference from request data

        # Ensure required data is provided
        if user_id is None or preference is None:
            return Response({"error": "Missing required fields"}, status=status.HTTP_400_BAD_REQUEST)

        # Try to get or create the LikedProduct instance without including 'preference' in the query filter
        liked_product, created = LikedProduct.objects.get_or_create(
            PID_id=product_id,
            UID_id=user_id,
            defaults={'preference': preference}  # Set default preference for creation
        )

        if not created:  # If the object already exists, update the preference
            liked_product.preference = preference
            liked_product.save()

        # Serialize the response
        serializer = LikedSerilizer(liked_product)
        return Response(serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK)


    def delete(self, request, *args, **kwargs):
        product_id = self.kwargs.get('product_id')  # Retrieve product_id from kwargs (URL)
        user_id = getUserId(request)  # Assuming this retrieves the user's ID

        if user_id is None:
            return Response({"error": "User not found"}, status=status.HTTP_403_FORBIDDEN)

        try:
            liked_product = LikedProduct.objects.get(PID_id=product_id, UID_id=user_id)
            liked_product.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)  # Successfully deleted
        except LikedProduct.DoesNotExist:
            return Response({'detail': 'Liked product not found.'}, status=status.HTTP_404_NOT_FOUND)

