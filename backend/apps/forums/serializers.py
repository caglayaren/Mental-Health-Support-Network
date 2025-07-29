from rest_framework import serializers
from .models import ForumCategory, ForumPost, PostReply, PostLike


class ForumCategorySerializer(serializers.ModelSerializer):
    """
    Serializer for forum categories
    """
    post_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ForumCategory
        fields = ('name', 'description', 'slug', 'icon', 'color', 'post_count', 'order')


class AuthorSerializer(serializers.Serializer):
    """
    Simple serializer for anonymous user info in posts/replies
    """
    username = serializers.CharField()
    display_name = serializers.CharField(allow_null=True)
    user_id = serializers.UUIDField()


class ForumPostSerializer(serializers.ModelSerializer):
    """
    Serializer for forum posts (read)
    """
    author = AuthorSerializer(read_only=True)
    category = ForumCategorySerializer(read_only=True)
    reply_count = serializers.ReadOnlyField()
    
    class Meta:
        model = ForumPost
        fields = (
            'post_id', 'title', 'content', 'author', 'category', 
            'tags', 'is_pinned', 'is_locked', 'view_count', 
            'like_count', 'reply_count', 'created_at', 'updated_at', 'last_activity'
        )


class ForumPostCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating forum posts
    """
    category_slug = serializers.SlugField(write_only=True)
    
    class Meta:
        model = ForumPost
        fields = ('title', 'content', 'category_slug', 'tags')
    
    def validate_category_slug(self, value):
        """
        Validate that the category exists and is active
        """
        try:
            category = ForumCategory.objects.get(slug=value, is_active=True)
            return category
        except ForumCategory.DoesNotExist:
            raise serializers.ValidationError("Invalid category or category is not active")
    
    def create(self, validated_data):
        """
        Create a new forum post
        """
        category = validated_data.pop('category_slug')
        post = ForumPost.objects.create(
            category=category,
            **validated_data
        )
        return post


class PostReplySerializer(serializers.ModelSerializer):
    """
    Serializer for post replies (read)
    """
    author = AuthorSerializer(read_only=True)
    is_nested_reply = serializers.ReadOnlyField()
    
    class Meta:
        model = PostReply
        fields = (
            'reply_id', 'content', 'author', 'parent_reply', 
            'is_nested_reply', 'like_count', 'created_at', 'updated_at'
        )


class PostReplyCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating post replies
    """
    parent_reply_id = serializers.UUIDField(required=False, allow_null=True)
    
    class Meta:
        model = PostReply
        fields = ('content', 'parent_reply_id')
    
    def validate_parent_reply_id(self, value):
        """
        Validate parent reply if provided
        """
        if value:
            try:
                parent_reply = PostReply.objects.get(reply_id=value, is_active=True)
                return parent_reply
            except PostReply.DoesNotExist:
                raise serializers.ValidationError("Invalid parent reply")
        return None
    
    def create(self, validated_data):
        """
        Create a new reply
        """
        parent_reply = validated_data.pop('parent_reply_id', None)
        reply = PostReply.objects.create(
            parent_reply=parent_reply,
            **validated_data
        )
        return reply


class ForumPostListSerializer(serializers.ModelSerializer):
    """
    Lightweight serializer for post lists
    """
    author = AuthorSerializer(read_only=True)
    category_name = serializers.CharField(source='category.name', read_only=True)
    reply_count = serializers.ReadOnlyField()
    latest_reply = serializers.SerializerMethodField()
    
    class Meta:
        model = ForumPost
        fields = (
            'post_id', 'title', 'author', 'category_name', 
            'is_pinned', 'view_count', 'like_count', 'reply_count',
            'latest_reply', 'created_at', 'last_activity'
        )
    
    def get_latest_reply(self, obj):
        """
        Get info about the latest reply
        """
        latest_reply = obj.latest_reply
        if latest_reply:
            return {
                'author': latest_reply.author.display_name or latest_reply.author.username,
                'created_at': latest_reply.created_at
            }
        return None


class PostLikeSerializer(serializers.ModelSerializer):
    """
    Serializer for post/reply likes
    """
    user = AuthorSerializer(read_only=True)
    
    class Meta:
        model = PostLike
        fields = ('user', 'created_at')