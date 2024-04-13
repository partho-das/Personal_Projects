from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_listing", views.create_listing, name="create_listing"),
    path("my_listings", views.my_listings, name="my_listings"),
    path("wishlist", views.wishlist, name = "wishlist"), 
    path("listing/<int:id>/", views.show_listing, name = "show_listing"),
    path("listing/<int:id>/<str:message>/", views.show_listing, name = "show_listing"),
    path("wishlist_toggler/<int:id>", views.wishlist_toggler, name = 'wishlist_toggler'),
    path("status_toggler/<int:id>", views.status_toggler, name = 'status_toggler'),
    path("list_categories", views.list_categories, name="categories"),
    path("category_listing/", views.category_listing, name="category_listing"),
    path("category_listing/<str:category>", views.category_listing, name="category_listing"),


]
