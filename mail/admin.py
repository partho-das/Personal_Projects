from django.contrib import admin
from .models import *

# Register your models here.



class UserAdmin(admin.ModelAdmin):
    list_display = ("email", )
    # filter_horizontal = ("wishlist", )


class EmailAdmin(admin.ModelAdmin):
    list_display = ("sender", "subject")
    filter_horizontal = ("recipients", )

admin.site.register(User, UserAdmin)
admin.site.register(Email, EmailAdmin)
