from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from encyclopedia import util
 
# Create your views here.


def index(request):
    return HttpResponseRedirect(reverse("encyclopedia:index"))


def create_page(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        if util.get_entry(title) is not None:
            return HttpResponse("<h1>Title Already Exist</h1>")
        util.save_entry(title, content)
        return HttpResponseRedirect(reverse("encyclopedia:index"))  
    return render(request, "query/create_page.html")

def edit_page(request):
    if request.method == "GET":
        title = request.GET.get('title')
        content = util.update_entry(title)
        return render(request, "query/edit_page.html", {
            'title' : title,
            'content' : content
        })
    
    title = request.POST.get("title")
    content = request.POST.get("content")
    util.save_entry(title, content)
    return HttpResponseRedirect(reverse('encyclopedia:show_page', args = [title]))


def random_page(request):
    return render(request, "query/random_page.html")

def search(request):
    key = request.GET.get('q')
    print(key)
    return render(request, "query/search.html")