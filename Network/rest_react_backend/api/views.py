from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenRefreshView
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework import status, generics, mixins
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly

from rest_framework.generics import ListCreateAPIView
from .serializer import PostSerializer, CommentSerializer, UserSerializer

from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render
from django.urls import reverse
from rest_framework.exceptions import PermissionDenied

from .models import User, Post, Comment
from django.forms.models import model_to_dict
from .pagination import CommentPagination

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')

        password = request.data.get('password')
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create_user(username=username, email=email, password=password, is_staff = True, is_superuser=True)
        user.save()
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
       
        user = authenticate(request, username=username, password=password)
        print(user)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    # Add more fields as needed
                }
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            print(refresh_token)
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class PostView(mixins.RetrieveModelMixin,
                         mixins.CreateModelMixin,
                         mixins.UpdateModelMixin,
                         mixins.DestroyModelMixin,
                         mixins.ListModelMixin,
                         generics.GenericAPIView,
                        ):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'pk'

    def get_queryset(self):
        qs = Post.objects.all()
        
        if 'network-feed' in self.request.path:
            user = self.request.user
            following_users = user.following.all()  # Assuming 'following' is a related manager on your User model
            qs = Post.objects.filter(user__in=following_users).order_by('-time') # Adjust as per your requirements
        elif 'user_pk' in self.kwargs:
            qs = qs.filter(user=self.kwargs['user_pk'])
        elif self.request.method == 'POST' or 'like-unlike' in self.request.path:
            # Return all posts for creation
            qs = Post.objects.all()
        elif self.request.method == 'GET':
            # For GET requests, check if the 'user_only' query parameter is set
            user_only = self.request.query_params.get('user-only')
            if user_only:
                # Return posts for the current user only
                qs = Post.objects.filter(user=self.request.user)
                print("HInow")
            else:
                # Return all posts
                qs = Post.objects.all()
        else:
            qs = Post.objects.filter(user=self.request.user)
        qs = qs.order_by('-id')
        return qs
    
    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs: # if kwargs.get('pk') is not None:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)
    def post(self, request, *args, **kwargs):
        if 'like-unlike' in self.request.path:
            return self.like_unlike(request, *args, **kwargs)
        return self.create(request, *args, **kwargs)
    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)
    def delete(self, request, *args, **kwargs):
        if 'like-unlike' in self.request.path:
            return self.like_unlike(request, *args, **kwargs)
        return self.destroy(request, *args, **kwargs)

    def perform_create(self, serializer):
        instance = serializer.save(user = self.request.user)

    def like_unlike(self, request, *args, **kwargs):
        post = self.get_object()
        if request.method == 'POST' :
            if not request.user in post.liked_by.all():
                post.liked_by.add(request.user)
        elif request.method == "DELETE":
            if request.user in post.liked_by.all():
                post.liked_by.remove(request.user)
        serializer = self.get_serializer(post, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"massage":"Update Done."}, status=status.HTTP_200_OK)
    # def get_queryset(self, *args, **kwargs):

    #         qs = super().get_queryset(*args, **kwargs)
    #         print(self.request.user)
    #         return qs.filter(user=self.request.user)


class CommentView(generics.GenericAPIView,
                        mixins.CreateModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        mixins.ListModelMixin):

    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    lookup_field = 'pk'
    pagination_class = CommentPagination
    def get_queryset(self):
    # Default queryset for all comments
        qs = Comment.objects.all()
        
        # Filter based on HTTP method and 'post_pk' in kwargs
        if self.request.method == "GET" or 'like-unlike' in self.request.path:
            # If 'post_pk' is present, filter comments for that specific post
            if 'post_pk' in self.kwargs:
                qs = qs.filter(post_id=self.kwargs['post_pk'])
        else:
            # For non-GET methods, filter comments by user
            if 'post_pk' in self.kwargs:
                qs = qs.filter(post_id=self.kwargs['post_pk'], user=self.request.user)
            else:
                qs = qs.filter(user=self.request.user)
        
        # Sort the queryset by 'id' in descending order
        qs = qs.order_by('-id')
        return qs


    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            return self.retrieve(request, *args, **kwargs)
        else:
            return self.list(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        if 'like-unlike' in request.path:
            return self.like_unlike(request, *args, **kwargs)
        return self.create(request, *args, **kwargs)

    def put(self, request, *args, **kwargs):
        kwargs['partial'] = True
        return self.update(request, *args, **kwargs)

    def delete(self, request, *args, **kwargs):
        if 'like-unlike' in request.path:
            return self.like_unlike(request, *args, **kwargs)
        else:
            return self.destroy(request, *args, **kwargs)


    def perform_create(self, serializer):
            serializer.save(user=self.request.user, post_id=self.kwargs['post_pk'])

    def like_unlike(self, request, *args, **kwargs):
        
        comment = self.get_object()
        if request.method == 'POST':
            print(comment)
            if request.user not in comment.liked_by.all():
                comment.liked_by.add(request.user)
        elif request.method == 'DELETE':
            if request.user in comment.liked_by.all():
                comment.liked_by.remove(request.user)
        else:
            return Response({'message': 'Method not allowed.'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        serializer = self.get_serializer(comment, data=self.request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'message': 'Update Done.'}, status=status.HTTP_200_OK)

class UserView(generics.GenericAPIView,
                        mixins.CreateModelMixin,
                        mixins.RetrieveModelMixin,
                        mixins.UpdateModelMixin,
                        mixins.DestroyModelMixin,
                        mixins.ListModelMixin):
    
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer
    lookup_field = 'pk'
    queryset = User.objects.all()

    def get_queryset(self):
        if 'followers' in self.request.path:
            return self.request.user.followers.all()
        elif 'following' in self.request.path:
            return self.request.user.following.all()
        return User.objects.all()

    def get(self, request, *args, **kwargs):
        if 'pk' in kwargs:
            # print(f"single: {self.queryset}")
            return self.retrieve(request, *args, **kwargs)
        elif 'profile' in self.request.path:
            user = request.user
            serializer = UserSerializer(user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return self.list(request, *args, **kwargs)

    def post(self, *args, **kwargs):
        user_to_follow = User.objects.get(pk=kwargs['pk'])
        if user_to_follow != self.request.user:
            self.request.user.following.add(user_to_follow)
            return Response({'message': 'Successfully followed the user.'}, status=status.HTTP_200_OK)
        return Response({'message': 'You cannot follow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, *args, **kwargs):
        user_to_unfollow = User.objects.get(pk=kwargs['pk'])
        if user_to_unfollow != request.user:
            request.user.following.remove(user_to_unfollow)
            return Response({'message': 'Successfully unfollowed the user.'}, status=status.HTTP_200_OK)
        return Response({'message': 'You cannot unfollow yourself.'}, status=status.HTTP_400_BAD_REQUEST)
    
    