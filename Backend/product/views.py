from rest_framework.generics import ListAPIView, ListCreateAPIView, CreateAPIView
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Category, Brand, Product, ProductComment, User
from .serializer import CategorySerilizer, BrandSerilizer, CommentSerializer, ProductSerializer
from Backend.utils import getUserId, getUserType
from .filters import ProductFilter

class CategoryApi(ListCreateAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerilizer

class BrandApi(ListCreateAPIView):
    serializer_class = BrandSerilizer
    def get_queryset(self):
        id = self.kwargs['id']
        return Brand.objects.filter(categoryID = id)

class GetProductById(ListAPIView):
    serializer_class = ProductSerializer
    def get_queryset(self):
        id = self.kwargs['id']
        return Product.objects.filter(id = id)

class GetCommentsByProductId(ListCreateAPIView):
    def get(self, request, *args, **kwargs):
        product_id = self.kwargs['product_id']
        comments = ProductComment.objects.filter(PID=product_id).order_by('-create_time')
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({"message":"You don't have permission to add product"}, status=status.HTTP_403_FORBIDDEN)
        else:
            request.data['UID'] = user_id
            request.data['PID'] = self.kwargs['product_id']
            serializer = CommentSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
                
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductApi(ListAPIView):
    queryset = Product.objects.all()  # Define the queryset
    serializer_class = ProductSerializer  # Specify the serializer class
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_class = ProductFilter
    search_fields = ['name', 'description', 'model']
    ordering_fields = ['price']

    def get_serializer_context(self):
        return {'request': self.request}

    # def post(self, request, *args, **kwargs):
        # if getUserType(request.headers.get('Authorization')) == 'S':
        #     serializer = ProductSerializer(data=request.data)
            
        #     if serializer.is_valid():
        #         serializer.save()
        #         return Response(serializer.data, status=status.HTTP_201_CREATED)
            
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        # else:
        #     return Response({"message": "You don't have this permission"})


class ProductManagement(CreateAPIView):
    def post(self, request, *args, **kwargs):
        user_type = getUserType(request)
        if user_type == User.SuperUser:
            if request.method == 'POST':
                serializer = ProductSerializer(data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message":"You don't have permission to add a product"}, status=status.HTTP_403_FORBIDDEN)
        
        
    def put(self, request, *args, **kwargs):
        user_type = getUserType(request)
        if user_type == User.SuperUser:
            try:
                pk = request.data['id']
                product = Product.objects.get(pk=pk)
            except Product.DoesNotExist:
                return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

            if request.method == 'PUT':
                serializer = ProductSerializer(product, data=request.data)
                print(request.data)
                if serializer.is_valid():
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_200_OK)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"message":"You don't have permission to edit a product"}, status=status.HTTP_403_FORBIDDEN)