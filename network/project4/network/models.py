from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils import timezone
from datetime import timedelta
import datetime


class User(AbstractUser):
    following = models.ManyToManyField('User', related_name="followers")
    
    def __str__(self):
        return self.username
    

class Post(models.Model):
    owner = models.ForeignKey('User', on_delete=models.CASCADE ,related_name='posts')
    timestamp  = models.DateTimeField(default=timezone.now)
    title = models.CharField(max_length=50, blank=True)
    content = models.CharField(max_length=500, blank=True)
    liked_by = models.ManyToManyField('User', related_name="liked_posts")
    comments = models.ManyToManyField('Comment', related_name='post', blank=True)

    def serializer(self, request):

        print(self.timestamp.strftime("%b %d %Y, %I:%M %p"))
        print(self.timestamp)
        print(timezone.now())
        return {
            'id': self.id,
            'owner': { "id": self.owner.id, 'username': self.owner.username},
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            'title': self.title,
            'content': self.content,
            'like_count': len(self.liked_by.all()),
            'like_status': 1 if request.user in self.liked_by.all() else 0,
            'comments' : [comment.serializer() for comment in self.comments.all().order_by('-timestamp')]

        }
    def __str__(self):
        return self.title

class Comment(models.Model):
    owner = models.ForeignKey('User', related_name='commments', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(default=timezone.now)
    content = models.CharField(max_length=100)
    liked_by = models.ManyToManyField('User', related_name="liked_comments")

    def serializer(self):
        shifted_timestamp = self.timestamp + timedelta(hours=6)
        return {
            'id': self.id,
            'owner': {"id": self.owner.id, 'username': self.owner.username},
            'timestamp': shifted_timestamp.strftime("%b %d %Y, %I:%M %p"),
            'content': self.content
        }

    def __str__(self):
        return f" {self.post}: {self.content}"