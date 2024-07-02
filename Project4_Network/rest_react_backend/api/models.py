from django.db import models
from django.contrib.auth.models import (AbstractUser)
from datetime import datetime
# Create your models here.

class User(AbstractUser):
    following = models.ManyToManyField('User', related_name='followers')
    # following = models.ManyToManyField('self', related_name='followers')

# # Specify unique related_name for groups and user_permissions
# User._meta.get_field('groups').remote_field.related_name = 'custom_user_groups'
# User._meta.get_field('user_permissions').remote_field.related_name = 'custom_user_permissions'


class Post(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="posts")
    time = models.DateTimeField(default=datetime.now)
    content = models.CharField(max_length=200)
    liked_by = models.ManyToManyField("User", related_name="liked_posts")

class Comment(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="comments")
    post = models.ForeignKey("Post", on_delete=models.CASCADE, related_name="comments")
    time = models.DateTimeField(default=datetime.now)
    content = models.CharField(max_length=100)
    liked_by = models.ManyToManyField("User", related_name="liked_comment")
