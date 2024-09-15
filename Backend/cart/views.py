from rest_framework.generics import ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart
from .serializer import CartSerializer, GetCartSerializer
from Backend.utils import getUserId

class CartProduct(ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        else:
            cart_item = Cart.objects.filter(UID=user_id)
            serializer = GetCartSerializer(cart_item, many=True)
            return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        else:
            request.data['UID'] = user_id
            serializer = CartSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)