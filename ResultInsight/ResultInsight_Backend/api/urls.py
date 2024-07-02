from django.urls import path, include
from . import views 
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path("", views.index, name="index"),
    path("hello_world/", views.index, name="index"),

    path("login/", views.LoginView.as_view(), name="login"), # POST
    path("logout/", views.LogoutView.as_view(), name="logout"), # POST
    path("register/", views.RegisterView.as_view(), name="register"), # POST
    
    path('refresh-token/', TokenRefreshView.as_view(), name='token_refresh'), # POST

    path("students/", views.StudentView.as_view(), name="ListStudent"),
    path("student/<int:reg_no>/", views.StudentView.as_view(), name="RetriveStudent"),

    path("<int:session>/students/", views.StudentView.as_view(), name="ListStudentPerSession"),
    
    path("subjects/", views.SubjectView.as_view(), name="ListSubject"),
    path("subject/<int:code>/", views.SubjectView.as_view(), name="RetriveSubject"),
     # Users
    path('user/<int:pk>/follow-unfollow/', views.UserView.as_view(), name='FollowUnfollowUser'), # POST (follow), DELETE (unfollow)
    path('user/<int:pk>/update-session/', views.UserView.as_view(), name='update-session'), # POST (follow), DELETE (unfollow)
    path('user/following/', views.UserView.as_view(), name='userfollowing'), # GET (list following)
    path('user/profile/', views.UserView.as_view(), name='userprofile'), # GET (retrieve user profile)

]
