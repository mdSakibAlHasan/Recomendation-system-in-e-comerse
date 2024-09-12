from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework import status
from .models import Category, Brand, Product
from .serializer import CategorySerilizer, BrandSerilizer, ProductSerializer
from Backend.utils import getUserType

class CategoryApi(ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerilizer

class BrandApi(ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerilizer

class ProductApi(ListAPIView):
    def get(self, request, *args, **kwargs):
        print(request.headers)
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
