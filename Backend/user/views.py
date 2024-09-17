from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from user.models import User
from user.serializer import RegisterSerializer, UserDetailsSerializer
from Backend.utils import generate_jwt_token, decode_jwt_token, getUserId

class Registrtion(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)    


class GetUserDetails(APIView):
    def get(self, request):
        user_id = getUserId(request)
        if user_id == None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        else:
            user = User.objects.filter(id=user_id)
            serializer = UserDetailsSerializer(user, many=True)
            return Response(serializer.data)
        

class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get("password")

        try:
            user = User.objects.get(email=email)
            if user:
                if user.password == password:
                    token = generate_jwt_token(user.id)
                    return Response({
                        'message': 'Login successful',
                        'token': token
                    })
               
                else:
                    return Response({"message":"wrong password"})
        
        except User.DoesNotExist:
            return Response({"message":"No such user exists"})
    
    def get(self, request):
        auth_header = request.headers.get('Authorization')

        if not auth_header:
            return Response({'message': 'Token missing'}, status=401)

        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]  
        else:
            return Response({'message': 'Invalid token format'}, status=401)

        user_id = decode_jwt_token(token)
        if user_id is None:
            return Response({'message': 'Invalid or expired token'}, status=401)
        try:
            user = User.objects.get(id=user_id)
            return Response({
                'username': user.username,
                'type': user.userType
                })

        except User.DoesNotExist:
            return Response({'message': 'User not found'}, status=404)
        

class UpdatePassword(APIView):
    def post(self, request):
        user_id = getUserId(request)
        if user_id is None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        
        oldPassword = request.data.get('oldPassword')
        newPassword = request.data.get("newPassword")

        try:
            user = User.objects.get(id=user_id)
            if user:
                if user.password == oldPassword:
                    serializer = RegisterSerializer(user, data={"password": newPassword}, partial=True)
                    serializer.is_valid(raise_exception=True)
                    serializer.save()
                    return Response({'message': "password updated", "isSuccess": True}, status=status.HTTP_200_OK) 
                else:
                    return Response({'message': 'Old password is incorrect', "isSuccess": False})
    
        except User.DoesNotExist:
            return Response({"message":"No such user exists"})
    
        