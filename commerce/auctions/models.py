from django.contrib.auth.models import AbstractUser
from django.db import models


    

class User(AbstractUser, models.Model):
    wishlist = models.ManyToManyField('Listing',  blank=True, related_name="wishuser")
    def __str__(self):
        return f"{self.username}"

class Listing(models.Model):
    CHOICES = (
        ('fashion', 'Fashion'),
        ('electronics', 'Electronics'),
        ('vehicle', 'Vehicle'),
        ('housing', 'Housing'),
        ('sports', 'Sports'),
        ('books', 'Books'),
        ('health', 'Health & Beauty'),
        ('toys', 'Toys & Games'),
        ('food', 'Food & Grocery'),
        # Add more categories as needed
    )
    
    def get_category_label(self):
        ret_label = "No Category"
        for value, label in self.CHOICES:
            if value == self.category:
                ret_label = label
                break
        return ret_label
    title = models.CharField(max_length=30)
    description = models.CharField(max_length=1000)
    image_url = models.URLField(max_length=200, blank=True,)
    asking_price = models.IntegerField()
    is_live = models.BooleanField(default=True)
    category = models.CharField(choices=CHOICES, max_length=50, blank=True,)
    time = models.DateTimeField()
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="listing")

    def __str__(self):
        return f"{self.id}: {self.title}"

class Comment(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="comment")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="comment")
    comment = models.CharField(max_length=200)
    time = models.DateTimeField()
    def __str__(self):
        return self.comment
 

class Bid(models.Model):
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="bidding")
    listing = models.ForeignKey("Listing", on_delete=models.CASCADE, related_name="bidding")
    offer_price = models.IntegerField()

    def __str__(self):
        return f" User: {self.user.username} and Bidding: {self.offer_price}"
    

