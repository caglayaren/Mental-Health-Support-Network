from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import AnonymousUser


@admin.register(AnonymousUser)
class AnonymousUserAdmin(UserAdmin):
    """
    Admin configuration for AnonymousUser model
    """
    # Fields to display in the user list
    list_display = ('username', 'display_name', 'user_id', 'is_anonymous', 'created_at', 'is_active')
    list_filter = ('is_anonymous', 'is_active', 'is_staff', 'created_at')
    search_fields = ('username', 'display_name', 'user_id')
    
    # Fields to show in the user detail/edit form
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Anonymous Profile', {
            'fields': ('display_name', 'bio', 'user_id', 'is_anonymous', 'preferred_topics')
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    # Fields to show when adding a new user
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'display_name', 'is_anonymous'),
        }),
    )
    
    readonly_fields = ('user_id', 'created_at', 'updated_at')
    ordering = ('-created_at',)