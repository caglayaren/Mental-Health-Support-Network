from django.db import models
from django.conf import settings
import uuid


class ForumCategory(models.Model):
    """
    Categories for organizing forum discussions
    """
    name = models.CharField(max_length=100, unique=True)
    description = models.TextField(max_length=500, blank=True, null=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50, blank=True, null=True)  # For emoji or icon class
    color = models.CharField(max_length=7, default='#3B82F6')  # Hex color code
    
    # Ordering and visibility
    order = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'forum_categories'
        verbose_name = 'Forum Category'
        verbose_name_plural = 'Forum Categories'
        ordering = ['order', 'name']
    
    def __str__(self):
        return self.name
    
    @property
    def post_count(self):
        """Get total number of posts in this category"""
        return self.posts.filter(is_active=True).count()
    
    @property
    def latest_post(self):
        """Get the latest post in this category"""
        return self.posts.filter(is_active=True).order_by('-created_at').first()


class ForumPost(models.Model):
    """
    Main forum posts created by users
    """
    post_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    title = models.CharField(max_length=200)
    content = models.TextField()
    
    # Relationships
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='forum_posts'
    )
    category = models.ForeignKey(
        ForumCategory,
        on_delete=models.CASCADE,
        related_name='posts'
    )
    
    # Post metadata
    tags = models.JSONField(default=list, blank=True)
    is_pinned = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    
    # Engagement metrics
    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'forum_posts'
        verbose_name = 'Forum Post'
        verbose_name_plural = 'Forum Posts'
        ordering = ['-is_pinned', '-last_activity']
    
    def __str__(self):
        return f"{self.title} by {self.author.username}"
    
    @property
    def reply_count(self):
        """Get number of replies to this post"""
        return self.replies.filter(is_active=True).count()
    
    @property
    def latest_reply(self):
        """Get the latest reply to this post"""
        return self.replies.filter(is_active=True).order_by('-created_at').first()
    
    def increment_view_count(self):
        """Increment view count when post is viewed"""
        self.view_count += 1
        self.save(update_fields=['view_count'])


class PostReply(models.Model):
    """
    Replies to forum posts
    """
    reply_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    content = models.TextField()
    
    # Relationships
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_replies'
    )
    post = models.ForeignKey(
        ForumPost,
        on_delete=models.CASCADE,
        related_name='replies'
    )
    parent_reply = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='nested_replies'
    )
    
    # Reply metadata
    is_active = models.BooleanField(default=True)
    like_count = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'forum_replies'
        verbose_name = 'Forum Reply'
        verbose_name_plural = 'Forum Replies'
        ordering = ['created_at']
    
    def __str__(self):
        return f"Reply by {self.author.username} on {self.post.title}"
    
    @property
    def is_nested_reply(self):
        """Check if this is a reply to another reply"""
        return self.parent_reply is not None


class PostLike(models.Model):
    """
    Track user likes on posts and replies
    """
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='forum_likes'
    )
    post = models.ForeignKey(
        ForumPost,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='likes'
    )
    reply = models.ForeignKey(
        PostReply,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='likes'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'forum_likes'
        verbose_name = 'Forum Like'
        verbose_name_plural = 'Forum Likes'
        # Ensure user can only like a post/reply once
        unique_together = [
            ['user', 'post'],
            ['user', 'reply']
        ]
    
    def __str__(self):
        if self.post:
            return f"{self.user.username} liked post: {self.post.title}"
        return f"{self.user.username} liked reply: {self.reply.reply_id}"