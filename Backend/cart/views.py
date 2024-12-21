from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Cart
# from ..product.models import Product
# from ..product.serializer import ProductSerializer
from .serializer import CartSerializer, GetCartSerializer
from Backend.utils import getUserId
from product.views import updateProductStock
from recomendation.similarity import compute_user_similarity

class CartProduct(ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        else:
            cart_item = Cart.objects.filter(UID=user_id, status = Cart.PENDING)
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
                compute_user_similarity()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
    def patch(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id is None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)

        # Expecting request.data to be a list of dictionaries (product_id and quantity)
        updates = request.data.get('updates', [])

        if not updates or not isinstance(updates, list):
            return Response({"detail": "Invalid input format, expected a list of updates."}, status=status.HTTP_400_BAD_REQUEST)

        updated_items = []
        errors = []

        for update in updates:
            id = update.get('id')
            quantity = update.get('quantity')
            status_code = update.get('status')
            cart_item = Cart.objects.filter(id=id).first()

            if not cart_item:
                errors.append({"error": "Cart item not found."})
                continue
            # if status == 'O':
            serializer = CartSerializer(cart_item, data={"quantity": quantity,"status": status_code}, partial=True)
            # else:
            #     serializer = CartSerializer(cart_item, data={"quantity": quantity,"status": Cart.CANCELED}, partial=True)

            if serializer.is_valid():
                serializer.save()
                updated_items.append(serializer.data)
            else:
                errors.append({"id": id, "error": serializer.errors})
               
            updateProductStock(cart_item.PID.id,quantity); 
            
        # Return the updated items and any errors encountered
        return Response({
            "updated_items": updated_items,
            "errors": errors
        }, status=status.HTTP_200_OK if updated_items else status.HTTP_400_BAD_REQUEST)
        

class CartItemCountView(ListAPIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        else:
            cart_count = Cart.objects.filter(UID=user_id, status = Cart.PENDING).count()
            return Response({'cart_count': cart_count})
        

class GetOrderHistory(ListAPIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({"message":"user not found"}, status=status.HTTP_403_FORBIDDEN)
        else:
            cart_item = Cart.objects.filter(UID=user_id, status = Cart.ORDERED)
            serializer = GetCartSerializer(cart_item, many=True)
            return Response(serializer.data)
        
        
class IsInCart(ListAPIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        product_id = self.kwargs['product_id']
        if user_id == None:
            return Response({"message":"user not found"}, status=status.HTTP_403_FORBIDDEN)
        else:
            cart_item = Cart.objects.filter(UID=user_id, PID = product_id, status = Cart.PENDING).count()
            if cart_item == 0:
                return Response(False)
            else:
                return Response(True)