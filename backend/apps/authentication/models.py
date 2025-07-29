from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid


class AnonymousUser(AbstractUser):
    """
    Custom user model for anonymous mental health support
    No personal information required for privacy protection
    """
    # Override email to be optional
    email = models.EmailField(blank=True, null=True)
    
    # Anonymous user fields
    user_id = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    display_name = models.CharField(max_length=50, blank=True, null=True)
    bio = models.TextField(max_length=500, blank=True, null=True)
    
    # Privacy settings
    is_anonymous = models.BooleanField(default=True)
    
    # Mental health related preferences
    preferred_topics = models.JSONField(default=list, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Remove first_name and last_name requirements
    first_name = models.CharField(max_length=150, blank=True)
    last_name = models.CharField(max_length=150, blank=True)
    
    def __str__(self):
        return self.display_name or f"Anonymous User {self.user_id}"
    
    class Meta:
        db_table = 'anonymous_users'
        verbose_name = 'Anonymous User'
        verbose_name_plural = 'Anonymous Users'