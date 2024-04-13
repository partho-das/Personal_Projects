from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.shortcuts import render, redirect
from django.urls import reverse
import datetime
from django.templatetags.static import static

from .models import *
from django import forms

class Listing_Model_Form(forms.ModelForm):
    class Meta:
        model = Listing
        fields = ['title','category', 'description', 'image_url', 'asking_price']
        exclude = ['user', 'time']
        widgets ={
            "title": forms.TextInput(attrs={'class': "form-control", 'placeholder': "Title "}), 
            "description": forms.Textarea(attrs={'rows':6, 'class': "form-control", 'placeholder': "Description of Listing"}),
            "image_url": forms.TextInput(attrs={'class': "form-control", 'placeholder':"Image Url (Optional)"}), 
            "asking_price": forms.NumberInput(attrs={'class': "form-control", 'placeholder': "Money in Dollar"}),
            "category": forms.Select(attrs={'class': "form-select", }),
            # 'time': forms.DateTimeInput(attrs={'class': 'form-control', 'type': 'datetime-local'}),
        }
    
        
def index(request):
    
    return render(request, "auctions/index.html", {
        'listings': Listing.objects.filter(is_live=True).order_by('-id')
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
            return render(request, "auctions/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "auctions/login.html")


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
            return render(request, "auctions/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "auctions/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "auctions/register.html")
    
@login_required
def create_listing(request):
    if request.method == "POST":
        form = Listing_Model_Form(request.POST)
        if form.is_valid():
            instance = form.save(commit=False)
            instance.user = request.user
            instance.time = datetime.datetime.now()
            if not instance.image_url:
                print(instance.image_url, "hi")
                instance.image_url = "https://t3.ftcdn.net/jpg/04/62/93/66/360_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg"

            instance.save()
            return HttpResponseRedirect( reverse('show_listing', args=[instance.id, "Successfully Created New Listing!"]))

    return render(request, "auctions/create_listing.html", {
        'form': Listing_Model_Form()
    })

@login_required
def my_listings(request):
    
    return render(request, 'auctions/my_listings.html', {
        "listings": Listing.objects.filter(user=request.user.id).order_by('-id'),
        'header_message': "My Listings"
    })

@login_required
def wishlist(request):
    return render(request, 'auctions/my_listings.html', {
        "listings": request.user.wishlist.all().order_by('-id'),
        'header_message': "My Wishlist"
    })

def show_listing(request, id, message=""):
    listing = Listing.objects.get(id = id)
    biddings = listing.bidding.order_by('-offer_price')[:3]
    comments = listing.comment.all()
    if request.method == "POST":
        if request.user.username != "":
            if request.POST["bid"]:
                    bid = int(request.POST["bid"])
                    if bid >= listing.asking_price and ( biddings.first() is None or bid > biddings.first().offer_price):
                        Bid.objects.create(user = request.user, listing = listing, offer_price = bid)
                        biddings = listing.bidding.order_by('-offer_price')[:3]
                        message = "Sucessful Bidding! Hope for the Best."
                    else:
                        message = "Bidding Is Too Low!"

            if request.POST["comment"]: 
                comment = request.POST["comment"]
                Comment.objects.create(user = request.user, listing = listing, comment = comment, time = datetime.datetime.now())
                comments = listing.comment.all() 
                message = "Comment Added!"
        else:
            message = "Login First!"
    if listing.is_live == False:
        if biddings.count():
            message = f"Biddings Closed! and the Winner is [ {biddings.first()}$ ]"
        else:
            message = f"Biddings Closed! and the Winner is No One, Reasons Bidding Yet :("


    current_top = listing.asking_price
    if not biddings.first() is None:
        current_top = max(current_top,  biddings.first().offer_price)
    # print( listing.CHOICES(listing.category))
    return render(request, 'auctions/show_listing.html', {
        "biddings": biddings,
        "listing": listing, 
        "comments": comments,
        "massage": message,
        'current_top': current_top

    })


def wishlist_toggler(request, id):
    listing = Listing.objects.get(id = id)
    if request.user.username != "":
        wishlist = request.user.wishlist
        if listing in wishlist.all():
            wishlist.remove(listing)
            message =  "Removed From Wishlist!"
        else:
            wishlist.add(listing)
            message = "Added to Wishlist!"
    else:
        message = "Login First!" 
    return HttpResponseRedirect(reverse('show_listing', args = [id, message,] ))


def status_toggler(request, id):
    listing = Listing.objects.get(id = id)
    
    if listing.is_live:
        listing.is_live = False
        message =  "Closed Bidding!"
    else:
        listing.is_live = True
        message = "This Bidding is Live!"
    listing.save()
    return HttpResponseRedirect(reverse('show_listing', args = [id, message,] ))

def list_categories(request):
    categories = Listing.CHOICES
    categories = sorted(categories)

    return render(request, 'auctions/list_categories.html', {
        "categories": categories
    })

def category_listing(request, category=""):
    listings = Listing.objects.filter(category=category).order_by('-id')
    category_label = "No Category"
    
    for value, label in Listing.CHOICES:
        print(value, category)
        if value == category:
            category_label = label
    
    return render(request, 'auctions/my_listings.html', {
        "listings": listings,
        'header_message': category_label
    })