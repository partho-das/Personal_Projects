from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse
from .models import User, Post, Comment
from django import forms
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt 
import json
from django.core.paginator import Paginator

class Post_Model_Form(forms.ModelForm):
    class Meta:
        model = Post
        fields = ['title', 'content']
        exclude = ['owner', 'timestamp', 'liked_by', 'comments']
        widgets = {
            'title': forms.TextInput(attrs={'class': "form-control", 'placeholder': "Post Title"}),
            'content': forms.Textarea(attrs={'class': "form-control", 'placeholder': "Post Content"}),  # Corrected 'form-cortrol' to 'form-control'
        }

def index(request):
    Post_obj = Post.objects.all().order_by("-timestamp")
    paginator = Paginator(Post_obj, 4)
    page_no = request.GET.get(('page'))
    posts = paginator.get_page(page_no)
    return render(request, "network/index.html", {
        "Posts": posts
    })


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")

    
def user_profile(request, id):

    # print(User.objects.get(id=id).posts.all())
    Post_obj = User.objects.get(id=id).posts.all().order_by("-timestamp")
    paginator = Paginator(Post_obj, 4)
    page_no = request.GET.get(('page'))
    posts = paginator.get_page(page_no)

    return render(request, 'network/user_profile.html', {
        "user_profile": User.objects.get(id=id),
        "Posts": posts, 
    })

def user_posts(request, id):
    posts = [ post.serializer(request) for post in Post.objects.filter(owner__id=id).order_by('-timestamp') ]
    # print(posts)
    return JsonResponse(posts, safe=False)
def posts(request):
    posts = [ post.serializer(request) for post in Post.objects.all().order_by('-timestamp') ]
    # print(posts)
    return JsonResponse(posts, safe=False)

def create_post(request):
    if request.method == "POST":
        form = Post_Model_Form(request.POST)
        massage = "Post Create Successfully!"
        if form.is_valid():
            instance = form.save(commit=False)
            instance.owner = request.user
            instance.save()
            return HttpResponseRedirect(reverse("index"))
        else: 
             massage = "Invaild Post!"
             return render(request, "network/create_post.html", {
                "massage": massage, 
                "form": Post_Model_Form(),
            })

    elif request.method == "GET":
        return render(request, "network/create_post.html", {
            "form": Post_Model_Form() 
        })

def create_comment(request, id):
    if request.method == "POST":
        content = request.POST['content']
        instance = Comment.objects.create(owner=request.user, content=content)
        Post.objects.filter(id=id).comments.add(instance)
        return JsonResponse("Comment Created!", status=200)
    return JsonResponse("Invalid Request!", 400)


@login_required
@csrf_exempt
def post_like_unlike(request, id):
    if request.user in User.objects.all():
        if request.user and request.method == "POST":
            status = json.loads(request.body).get('like')
            if status is not None:
                if status == True:
                    Post.objects.get(id=id).liked_by.add(request.user)
                else:
                    Post.objects.get(id=id).liked_by.remove(request.user)
                return JsonResponse({"message": "Successful Operaton"}, status=200)
    return JsonResponse({"message": "Bad Request"}, status=400)

@login_required
@csrf_exempt
def add_comment(request, id):
    if request.user in User.objects.all():
        if request.user and request.method == "POST":
           content = json.loads(request.body).get("content")
           if content is not None:
               instance = Comment.objects.create(owner=request.user, content=content)
               Post.objects.get(id=id).comments.add(instance)
           return JsonResponse({"message": "Sucessful Comment"}, status=200, safe=False)

    return JsonResponse({"message": "Bad Request"}, status=400)
    
def load_post(request, id):
    if request.method == "GET":
        post = Post.objects.get(id=id)
        post = post.serializer(request)
        # print(post)
    return JsonResponse(post, safe=False)


def following(request):
    Post_obj = Post.objects.filter(owner__in = request.user.following.all() ).order_by('-timestamp')
    paginator = Paginator(Post_obj, 4)
    page_no = request.GET.get(('page'))
    posts = paginator.get_page(page_no)

    return render(request, "network/following.html", {
        "Posts": posts
    })

@login_required
def following_list(request):
    return render(request, "network/following_list.html", {

    })
@login_required
def follow_unfollow(request, id):
    people = User.objects.get(id=id)
    if people in request.user.following.all():
        request.user.following.remove(people)
        request.user.save()
        return JsonResponse({"message": "Unfollowed"}, status=200) 
    else:
        request.user.following.add(people)
        request.user.save()
        return JsonResponse({"message": "Followed"}, status=200) 
    
@login_required
def edit_post(request, id):
    # Get the post object or return 404 if not found
    post = get_object_or_404(Post, id=id, owner=request.user)
    
    if request.method == "POST":
        form = Post_Model_Form(request.POST, instance=post)
        if form.is_valid():
            form.save()  # Save the updated post instance
            message = "Post Updated Successfully!"
            return HttpResponseRedirect(reverse("index"))
        else:
            message = "Invalid Post!"
            return render(request, "network/edit_post.html", {
                "message": message,
                "post": post,
                "form": form,
            })
    else:  # GET request
        form = Post_Model_Form(instance=post)
        return render(request, "network/edit_post.html", {
            "form": form,
            "post": post,
        })