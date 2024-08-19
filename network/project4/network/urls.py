
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("create_post", views.create_post, name="create_post"),
    path("following", views.following, name="following"),
    path("following-list/", views.following_list, name="following_list"),
    path("edit_post/<int:id>/", views.edit_post, name="edit_post"),
    #api
    path("user_profile/<int:id>/", views.user_profile, name="user_profile"),
    path('post/<int:id>/', views.load_post, name="load_post"),
    path('user/<int:id>/posts/', views.user_posts, name="user_posts"),
    path('post/<int:id>/like-unlike/', views.post_like_unlike, name="like-unlike"),
    path('post/<int:id>/addcomment/', views.add_comment, name="add_comment"),
    path('follow-unfollow/<int:id>/', views.follow_unfollow, name="follow-unfollow"),
]

