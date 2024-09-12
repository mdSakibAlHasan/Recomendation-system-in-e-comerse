from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from user.models import User
from user.serializer import RegisterSerializer
from Backend.utils import generate_jwt_token, decode_jwt_token

class Registrtion(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)    


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
        