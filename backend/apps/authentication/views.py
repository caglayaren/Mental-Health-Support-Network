from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import login, logout
from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserProfileSerializer,
    UserProfileUpdateSerializer
)
from .models import AnonymousUser


@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """
    Register a new anonymous user
    """
    serializer = UserRegistrationSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Create authentication token
        token, created = Token.objects.get_or_create(user=user)
        
        # Return user data with token
        user_serializer = UserProfileSerializer(user)
        
        return Response({
            'message': 'User registered successfully',
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """
    Login user and return authentication token
    """
    serializer = UserLoginSerializer(data=request.data)
    
    if serializer.is_valid():
        user = serializer.validated_data['user']
        
        # Create or get token
        token, created = Token.objects.get_or_create(user=user)
        
        # Login user
        login(request, user)
        
        # Return user data with token
        user_serializer = UserProfileSerializer(user)
        
        return Response({
            'message': 'Login successful',
            'user': user_serializer.data,
            'token': token.key
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """
    Logout user and delete authentication token
    """
    try:
        # Delete the user's token
        token = Token.objects.get(user=request.user)
        token.delete()
        
        # Logout user
        logout(request)
        
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)
        
    except Token.DoesNotExist:
        return Response({
            'message': 'Logout successful'
        }, status=status.HTTP_200_OK)


@api_view(['GET'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """
    Get current user's profile information
    """
    serializer = UserProfileSerializer(request.user)
    
    return Response({
        'user': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['PUT', 'PATCH'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """
    Update current user's profile information
    """
    serializer = UserProfileUpdateSerializer(
        request.user, 
        data=request.data, 
        partial=request.method == 'PATCH'
    )
    
    if serializer.is_valid():
        user = serializer.save()
        
        # Return updated user data
        user_serializer = UserProfileSerializer(user)
        
        return Response({
            'message': 'Profile updated successfully',
            'user': user_serializer.data
        }, status=status.HTTP_200_OK)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def delete_user_account(request):
    """
    Delete current user's account
    """
    user = request.user
    
    # Delete user's token
    try:
        token = Token.objects.get(user=user)
        token.delete()
    except Token.DoesNotExist:
        pass
    
    # Delete user account
    user.delete()
    
    return Response({
        'message': 'Account deleted successfully'
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def api_status(request):
    """
    Check API status - health check endpoint
    """
    return Response({
        'status': 'API is running',
        'message': 'Mental Health Support Network API v1.0',
        'authenticated': request.user.is_authenticated
    }, status=status.HTTP_200_OK)