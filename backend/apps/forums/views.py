from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Q
from .models import ForumCategory, ForumPost, PostReply, PostLike
from .serializers import (
    ForumCategorySerializer,
    ForumPostSerializer,
    ForumPostCreateSerializer,
    PostReplySerializer,
    PostReplyCreateSerializer
)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_forum_categories(request):
    """
    Get list of all active forum categories
    """
    categories = ForumCategory.objects.filter(is_active=True).order_by('order', 'name')
    serializer = ForumCategorySerializer(categories, many=True)
    
    return Response({
        'categories': serializer.data
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_posts_by_category(request, category_slug):
    """
    Get all posts in a specific category
    """
    category = get_object_or_404(ForumCategory, slug=category_slug, is_active=True)
    
    # Get query parameters
    search = request.GET.get('search', '')
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    
    # Filter posts
    posts = ForumPost.objects.filter(category=category, is_active=True)
    
    if search:
        posts = posts.filter(
            Q(title__icontains=search) | 
            Q(content__icontains=search) |
            Q(tags__icontains=search)
        )
    
    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    total_posts = posts.count()
    posts = posts[start:end]
    
    serializer = ForumPostSerializer(posts, many=True)
    
    return Response({
        'category': ForumCategorySerializer(category).data,
        'posts': serializer.data,
        'pagination': {
            'page': page,
            'page_size': page_size,
            'total': total_posts,
            'has_next': end < total_posts,
            'has_previous': page > 1
        }
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def create_forum_post(request):
    """
    Create a new forum post
    """
    serializer = ForumPostCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        post = serializer.save(author=request.user)
        
        # Return created post
        post_serializer = ForumPostSerializer(post)
        
        return Response({
            'message': 'Post created successfully',
            'post': post_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def get_post_detail(request, post_id):
    """
    Get detailed view of a specific post with replies
    """
    post = get_object_or_404(ForumPost, post_id=post_id, is_active=True)
    
    # Increment view count
    post.increment_view_count()
    
    # Get replies
    replies = PostReply.objects.filter(post=post, is_active=True).order_by('created_at')
    
    # Serialize data
    post_serializer = ForumPostSerializer(post)
    replies_serializer = PostReplySerializer(replies, many=True)
    
    return Response({
        'post': post_serializer.data,
        'replies': replies_serializer.data,
        'reply_count': replies.count()
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def reply_to_post(request, post_id):
    """
    Reply to a forum post
    """
    post = get_object_or_404(ForumPost, post_id=post_id, is_active=True)
    
    # Check if post is locked
    if post.is_locked:
        return Response({
            'error': 'This post is locked and cannot receive new replies'
        }, status=status.HTTP_403_FORBIDDEN)
    
    serializer = PostReplyCreateSerializer(data=request.data)
    
    if serializer.is_valid():
        reply = serializer.save(author=request.user, post=post)
        
        # Update post's last activity
        post.last_activity = reply.created_at
        post.save(update_fields=['last_activity'])
        
        # Return created reply
        reply_serializer = PostReplySerializer(reply)
        
        return Response({
            'message': 'Reply posted successfully',
            'reply': reply_serializer.data
        }, status=status.HTTP_201_CREATED)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def like_post(request, post_id):
    """
    Like or unlike a forum post
    """
    post = get_object_or_404(ForumPost, post_id=post_id, is_active=True)
    
    # Check if user already liked this post
    like, created = PostLike.objects.get_or_create(
        user=request.user,
        post=post,
        defaults={}
    )
    
    if created:
        # User liked the post
        post.like_count += 1
        post.save(update_fields=['like_count'])
        message = 'Post liked successfully'
        liked = True
    else:
        # User unliked the post
        like.delete()
        post.like_count = max(0, post.like_count - 1)
        post.save(update_fields=['like_count'])
        message = 'Post unliked successfully'
        liked = False
    
    return Response({
        'message': message,
        'liked': liked,
        'like_count': post.like_count
    }, status=status.HTTP_200_OK)


@api_view(['POST'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def like_reply(request, reply_id):
    """
    Like or unlike a forum reply
    """
    reply = get_object_or_404(PostReply, reply_id=reply_id, is_active=True)
    
    # Check if user already liked this reply
    like, created = PostLike.objects.get_or_create(
        user=request.user,
        reply=reply,
        defaults={}
    )
    
    if created:
        # User liked the reply
        reply.like_count += 1
        reply.save(update_fields=['like_count'])
        message = 'Reply liked successfully'
        liked = True
    else:
        # User unliked the reply
        like.delete()
        reply.like_count = max(0, reply.like_count - 1)
        reply.save(update_fields=['like_count'])
        message = 'Reply unliked successfully'
        liked = False
    
    return Response({
        'message': message,
        'liked': liked,
        'like_count': reply.like_count
    }, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([AllowAny])
def search_posts(request):
    """
    Search posts across all categories
    """
    query = request.GET.get('q', '')
    category_slug = request.GET.get('category', '')
    page = int(request.GET.get('page', 1))
    page_size = int(request.GET.get('page_size', 20))
    
    if not query:
        return Response({
            'error': 'Search query is required'
        }, status=status.HTTP_400_BAD_REQUEST)
    
    # Filter posts
    posts = ForumPost.objects.filter(is_active=True)
    
    if category_slug:
        posts = posts.filter(category__slug=category_slug)
    
    posts = posts.filter(
        Q(title__icontains=query) | 
        Q(content__icontains=query) |
        Q(tags__icontains=query)
    )
    
    # Pagination
    start = (page - 1) * page_size
    end = start + page_size
    total_posts = posts.count()
    posts = posts[start:end]
    
    serializer = ForumPostSerializer(posts, many=True)
    
    return Response({
        'query': query,
        'posts': serializer.data,
        'pagination': {
            'page': page,
            'page_size': page_size,
            'total': total_posts,
            'has_next': end < total_posts,
            'has_previous': page > 1
        }
    }, status=status.HTTP_200_OK)