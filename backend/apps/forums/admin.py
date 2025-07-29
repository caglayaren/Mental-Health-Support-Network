from django.contrib import admin
from .models import ForumCategory, ForumPost, PostReply, PostLike


@admin.register(ForumCategory)
class ForumCategoryAdmin(admin.ModelAdmin):
    """
    Admin configuration for ForumCategory
    """
    list_display = ('name', 'slug', 'post_count', 'order', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    prepopulated_fields = {'slug': ('name',)}
    list_editable = ('order', 'is_active')
    ordering = ('order', 'name')


@admin.register(ForumPost)
class ForumPostAdmin(admin.ModelAdmin):
    """
    Admin configuration for ForumPost
    """
    list_display = ('title', 'author', 'category', 'reply_count', 'view_count', 'is_pinned', 'is_locked', 'is_active', 'created_at')
    list_filter = ('category', 'is_pinned', 'is_locked', 'is_active', 'created_at')
    search_fields = ('title', 'content', 'author__username')
    readonly_fields = ('post_id', 'view_count', 'like_count', 'created_at', 'updated_at')
    list_editable = ('is_pinned', 'is_locked', 'is_active')
    raw_id_fields = ('author',)
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('title', 'content', 'author', 'category')
        }),
        ('Settings', {
            'fields': ('tags', 'is_pinned', 'is_locked', 'is_active')
        }),
        ('Metrics', {
            'fields': ('post_id', 'view_count', 'like_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PostReply)
class PostReplyAdmin(admin.ModelAdmin):
    """
    Admin configuration for PostReply
    """
    list_display = ('author', 'post', 'parent_reply', 'like_count', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('content', 'author__username', 'post__title')
    readonly_fields = ('reply_id', 'like_count', 'created_at', 'updated_at')
    raw_id_fields = ('author', 'post', 'parent_reply')
    ordering = ('-created_at',)
    
    fieldsets = (
        (None, {
            'fields': ('content', 'author', 'post', 'parent_reply')
        }),
        ('Settings', {
            'fields': ('is_active',)
        }),
        ('Metrics', {
            'fields': ('reply_id', 'like_count'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    """
    Admin configuration for PostLike
    """
    list_display = ('user', 'post', 'reply', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('user__username', 'post__title')
    raw_id_fields = ('user', 'post', 'reply')
    ordering = ('-created_at',)