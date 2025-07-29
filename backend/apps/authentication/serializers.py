from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import AnonymousUser


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Serializer for anonymous user registration
    """
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    
    class Meta:
        model = AnonymousUser
        fields = ('username', 'password', 'confirm_password', 'display_name')
        
    def validate(self, attrs):
        """
        Check that the two password entries match
        """
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def create(self, validated_data):
        """
        Create and return a new anonymous user
        """
        # Remove confirm_password from validated_data
        validated_data.pop('confirm_password', None)
        
        # Create user
        user = AnonymousUser.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            display_name=validated_data.get('display_name', ''),
            is_anonymous=True
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    """
    Serializer for user login
    """
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        """
        Validate and authenticate the user
        """
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError('Invalid credentials')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include username and password')
        
        return attrs


class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for user profile information
    """
    user_id = serializers.UUIDField(read_only=True)
    
    class Meta:
        model = AnonymousUser
        fields = ('user_id', 'username', 'display_name', 'bio', 'preferred_topics', 
                 'is_anonymous', 'created_at')
        read_only_fields = ('user_id', 'username', 'created_at', 'is_anonymous')


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating user profile
    """
    class Meta:
        model = AnonymousUser
        fields = ('display_name', 'bio', 'preferred_topics')
        
    def validate_preferred_topics(self, value):
        """
        Validate preferred topics list
        """
        if not isinstance(value, list):
            raise serializers.ValidationError("Preferred topics must be a list")
        
        # Limit to 10 topics max
        if len(value) > 10:
            raise serializers.ValidationError("Maximum 10 preferred topics allowed")
            
        return value