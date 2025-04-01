from django.contrib.auth.models import User
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import re

def validate_email(email):
    """ Check if email is valid """
    email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
    return re.match(email_regex, email)

def validate_password(password):
    """ Check if password meets security criteria """
    return len(password) >= 8 and any(char.isdigit() for char in password) and any(not char.isalnum() for char in password)

@api_view(['POST'])
def signup(request):
    email = request.data.get('email').strip().lower()
    password = request.data.get('password')

    # Validate email format
    if not email or not validate_email(email):
        return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

    # Validate password strength
    if not password or not validate_password(password):
        return Response({'error': 'Password must be at least 8 characters long, contain a number and a special character'}, 
                        status=status.HTTP_400_BAD_REQUEST)

    if User.objects.filter(username=email).exists():
        return Response({'error': 'User already exists'}, status=status.HTTP_400_BAD_REQUEST)

    user = User.objects.create_user(username=email, email=email, password=password)
    refresh = RefreshToken.for_user(user)

    return Response({
            "token": str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {"email": user.email},
            "message": "User registered successfully"
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
def login(request):
    email = request.data.get('email').strip().lower()
    password = request.data.get('password')

    # Validate email and password input
    if not email or not validate_email(email):
        return Response({'error': 'Invalid email format'}, status=status.HTTP_400_BAD_REQUEST)

    if not password:
        return Response({'error': 'Password is required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=email, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'token': str(refresh.access_token),
            "refresh_token": str(refresh),
            "user": {"email": user.email},
            'message': 'Login successful'
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
