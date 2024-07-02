from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import (User, Post, Comment)

class UserAdminR(admin.ModelAdmin):
    list_display = ('id', 'username', 'is_staff')
    list_display_links = ('id', 'username')
    filter_horizontal = ('following',) 
    
    pass
# Register your models here.

admin.site.register(User, UserAdminR)

# admin.site.register(User)


admin.site.register(Post)
admin.site.register(Comment)
