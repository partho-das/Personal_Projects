from django.shortcuts import render

from . import util
import markdown


def index(request):
    return render(request, "encyclopedia/index.html", {
        "title": util.list_entries(),
    })

def show_page(request, title):

    try:
        # print(util.get_entry(title), "hi")
        passage = markdown.markdown( util.get_entry(title) )
    except AttributeError:
        passage = markdown.markdown("# Noting Found! No This Entrie")
    
    return render(request, "encyclopedia/showpage.html", {
        'content' : passage,
        'title' : title
    })