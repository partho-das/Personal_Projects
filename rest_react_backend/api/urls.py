from django.urls import path
from .views import RegisterView, LoginView, UserView, LogoutView, PostView, CommentView
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

urlpatterns = [
    # Authentication
    path("login/", views.LoginView.as_view(), name="login"), # POST
    path("logout/", views.LogoutView.as_view(), name="logout"), # POST
    path("register/", RegisterView.as_view(), name="register"), # POST
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'), # POST

    # Posts
    path('posts/', PostView.as_view(), name='PostCreateOrList'), # GET (list), POST (create),
    path('posts/network-feed/', PostView.as_view(), name='PostNetworkfeed'), # GET (list)
    path('post/<int:pk>/', PostView.as_view(), name='PostUDR'), # GET (retrieve), PUT (update), DELETE (destroy)
    path('post/user/<int:user_pk>/', PostView.as_view(), name='userPost'), # GET (retrieve), PUT (update), DELETE (destroy)
    path('post/<int:pk>/like-unlike/', PostView.as_view(), name='PostLikeUnlike'), # POST (like), DELETE (unlike)

    # Comments
    path('post/<int:post_pk>/comments/', CommentView.as_view(), name='CommentCreate'), # GET (list), POST (create)
    path('comment/<int:pk>/', CommentView.as_view(), name='CommentLUDR'), # GET (retrieve), PUT (update), DELETE (destroy)
    path('comment/<int:pk>/like-unlike/', CommentView.as_view(), name='CommentLikeUnlike'), # POST (like), DELETE (unlike)

    # Users
    path('user/<int:pk>/follow-unfollow/', UserView.as_view(), name='FollowUnfollowUser'), # POST (follow), DELETE (unfollow)
    path('user/followers/', UserView.as_view(), name='userfollowers'), # GET (list followers)
    path('user/following/', UserView.as_view(), name='userfollowing'), # GET (list following)
    path('users/', UserView.as_view(), name='users'), # GET (list users)
    path('user/<int:pk>/', UserView.as_view(), name='user'), # GET (retrieve user)
    path('user/profile/', UserView.as_view(), name='userprofile'), # GET (retrieve user profile)

]