from django.urls import path
from . import views

app_name = 'forums'

urlpatterns = [
    # Forum categories
    path('categories/', views.get_forum_categories, name='categories'),
    path('categories/<str:category_slug>/posts/', views.get_posts_by_category, name='category_posts'),
    
    # Forum posts
    path('posts/', views.create_forum_post, name='create_post'),
    path('posts/<uuid:post_id>/', views.get_post_detail, name='post_detail'),
    path('posts/<uuid:post_id>/replies/', views.reply_to_post, name='reply_to_post'),
    path('posts/<uuid:post_id>/like/', views.like_post, name='like_post'),
    
    # Replies
    path('replies/<uuid:reply_id>/like/', views.like_reply, name='like_reply'),
    
    # Search
    path('search/', views.search_posts, name='search_posts'),
]