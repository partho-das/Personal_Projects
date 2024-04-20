from django.shortcuts import render

from . import util
import markdown


def index(request):
    return render(request, "encyclopedia/index.html", {
        "entries": util.list_entries()
    })

def show_page(request, title):

    try:
        # print(util.get_entry(title), "hi")
        content = markdown.markdown( util.get_entry(title) )
    except AttributeError:
        return render(request, "encyclopedia/massage.html",{
        'title' : 'No Page Found',
        'massage': 'Error 404! Nothing Found On This Entry'
    })
    
    return render(request, "encyclopedia/showpage.html", {
        'content' : content,
        'title' : title
    })