import jwt
from datetime import datetime, timedelta
from django.conf import settings

from user.models import User

# Function to generate JWT token
def generate_jwt_token(user_id):
    payload = {
        'user_id': user_id,
        'exp': datetime.utcnow() + settings.JWT_EXPIRATION_DELTA,  # Token expiration time
        'iat': datetime.utcnow()  # Issued at
    }
    token = jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm='HS256')
    return token

# Function to decode JWT token and extract the user ID
def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=['HS256'])
        return payload['user_id']
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Token is invalid

def getUserType(auth_header):
    if not auth_header:
        return 'W'

    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ')[1]  
    else:
        return 'W'

    user_id = decode_jwt_token(token)
    if user_id is None:
        return 'W'
    try:
        user = User.objects.get(id=user_id)
        return user.userType
           
    except User.DoesNotExist:
        return 'W'