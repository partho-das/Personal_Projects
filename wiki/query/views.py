from django.shortcuts import render
from django.http import HttpResponseRedirect, HttpResponse
from django.urls import reverse
from encyclopedia import util
from random import randint
 
# Create your views here.


def index(request):
    return HttpResponseRedirect(reverse("encyclopedia:index"))

def create_page(request):
    if request.method == "POST":
        title = request.POST.get("title")
        content = request.POST.get("content")
        if util.get_entry(title) is not None:
            return HttpResponse("<h1>Error: An Entry Already Exist With This Title</h1>")
        util.save_entry(title, content)
        return HttpResponseRedirect(reverse("encyclopedia:index"))  
    return render(request, "query/create_page.html")

def edit_page(request):
    if request.method == "GET":
        title = request.GET.get('title')
        content = util.get_entry(title)
        print(f"Title : {title}")
        return render(request, "query/edit_page.html", {
            'title' : title,
            'content' : content
        })
    
    title = request.POST.get("title")
    content = request.POST.get("content")
    operation = request.POST.get("operation")
    if operation == "Delete Entry":
        util.delete_entry(title)
        return render(request, 'encyclopedia/massage.html', {
            'title':'Entry Deleted',
            'massage':"Entry Deleted Successfully!"
        })
    util.save_entry(title, content)
    return HttpResponseRedirect(reverse('encyclopedia:show_page', args = [title]))


def random_page(request):
    list = util.list_entries()
    
    rnum = randint(0, len(list) - 1)
    return HttpResponseRedirect(reverse('encyclopedia:show_page', args=[list[rnum]]))

def search(request):
    lists = util.list_entries()
    key = request.GET.get('q')
    subStrList = [ ]
    for title in lists:
        if title == key:
            return HttpResponseRedirect(reverse('encyclopedia:show_page', args =[title]))

    for title in lists:
        if key in title:
            subStrList.append(title)
    
    return render(request, 'encyclopedia/index.html', {
        "entries" : subStrList
    })
            

    
    return render(request, "query/search.html")