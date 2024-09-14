from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Brand, Product, ProductComment
from .serializer import CategorySerilizer, BrandSerilizer, CommentSerializer, ProductSerializer
from Backend.utils import getUserType

class CategoryApi(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerilizer

class BrandApi(ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerilizer

class GetProductById(ListAPIView):
    serializer_class = ProductSerializer
    def get_queryset(self):
        id = self.kwargs['id']
        return Product.objects.filter(id = id)

class GetCommentsByProductId(ListAPIView):
    serializer_class = CommentSerializer
    def get_queryset(self):
        product_id = self.kwargs['product_id']
        return ProductComment.objects.filter(PID=product_id)

class ProductApi(ListAPIView):
    def get(self, request, *args, **kwargs):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        if getUserType(request.headers.get('Authorization')) == 'S':
            serializer = ProductSerializer(data=request.data)
            
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message": "You don't have this permission"})
