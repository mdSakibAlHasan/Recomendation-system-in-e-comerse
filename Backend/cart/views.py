from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.response import Response
from rest_framework import status

from product.models import Product
from .models import Cart
from rest_framework.views import APIView
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
                compute_user_similarity(user_id)
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
            # compute_user_similarity(user_id)
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
            
            

from django.db.models import F
import pandas as pd
from rest_framework.views import APIView
from rest_framework.response import Response
from mlxtend.frequent_patterns import apriori, association_rules
from mlxtend.preprocessing import TransactionEncoder

def fetch_transaction_data():
    """
    Fetch transaction data from Cart model.
    Each row corresponds to a product in a transaction.
    """
    transactions = (
        Cart.objects.filter(status='O')  # Consider only ordered carts
        .values('UID', 'PID')
    )

    # Convert to a DataFrame for processing
    transaction_df = pd.DataFrame(transactions)
    return transaction_df

def prepare_transaction_list(transaction_df):
    """
    Group products by users to prepare for Apriori.
    """
    transaction_list = (
        transaction_df.groupby('UID')['PID']
        .apply(list)
        .tolist()
    )
    return transaction_list

def apply_apriori(transaction_list):
    # Encode transactions into a DataFrame
    te = TransactionEncoder()
    te_ary = te.fit(transaction_list).transform(transaction_list)
    df = pd.DataFrame(te_ary, columns=te.columns_)

    # Generate frequent itemsets and association rules
    frequent_itemsets = apriori(df, min_support=0.1, use_colnames=True)
    rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1.0)

    # Fetch product details
    product_queryset = Product.objects.all()
    product_map = {product.id: {"name": product.name, "description": product.description} for product in product_queryset}

    # Prepare results
    results = []
    for _, rule in rules.iterrows():
        # Convert frozenset to list and map product details
        antecedents = list(rule["antecedents"])
        consequents = list(rule["consequents"])

        antecedent_details = [
            {"id": pid, "name": product_map[pid]["name"], "description": product_map[pid]["description"]}
            for pid in antecedents if pid in product_map
        ]
        consequent_details = [
            {"id": pid, "name": product_map[pid]["name"], "description": product_map[pid]["description"]}
            for pid in consequents if pid in product_map
        ]

        results.append({
            "antecedents": antecedent_details,
            "consequents": consequent_details
        })

    return results

class MerchantInsightsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            # Process transaction data
            transaction_df = fetch_transaction_data()
            transaction_list = prepare_transaction_list(transaction_df)
            rules = apply_apriori(transaction_list)

            # Return the results directly
            return Response(rules)

        except Exception as e:
            print(f"Error: {e}")  # Debug the exact error
            return Response({"error": str(e)}, status=500)


