from django.shortcuts import render

from . import util
import markdown


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def show_page(request, title):
    
    p = markdown.markdown(util.get_entry(title))
    print(type(p))
    return render(request, "encyclopedia/showpage.html", {
        'result' : markdown.markdown(util.get_entry(title)),
        'title' : title
    })