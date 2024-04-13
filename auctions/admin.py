from django.contrib import admin
from .models import *

# Register your models here.


class UserAdmin(admin.ModelAdmin):
    list_display = ("username",)
    filter_horizontal = ("wishlist", )
class ListingAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "title", "asking_price","is_live")
class BidAdmin(admin.ModelAdmin):
    list_display = ("user", "listing", "offer_price", )
class CommentAdmin(admin.ModelAdmin):
    list_display = ("user", "listing", "comment", )

admin.site.register(User, UserAdmin)
admin.site.register(Listing, ListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Bid, BidAdmin)
# admin.site.register(Common)


