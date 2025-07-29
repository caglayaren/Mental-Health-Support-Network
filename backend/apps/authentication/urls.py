from django.urls import path
from . import views

app_name = 'authentication'

urlpatterns = [
    # Health check
    path('status/', views.api_status, name='api_status'),
    
    # Authentication endpoints
    path('register/', views.register_user, name='register'),
    path('login/', views.login_user, name='login'),
    path('logout/', views.logout_user, name='logout'),
    
    # Profile endpoints
    path('profile/', views.get_user_profile, name='profile'),
    path('profile/update/', views.update_user_profile, name='profile_update'),
    path('profile/delete/', views.delete_user_account, name='profile_delete'),
]