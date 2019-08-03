from django.shortcuts import render
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.shortcuts import redirect
from django.http import HttpResponseNotFound, HttpResponse
from .models import Post,Comments
from django.utils import timezone
from django.core import serializers
import json
from django.forms.models import model_to_dict


def index(request):
    if request.user.is_authenticated():
        latest_posts=Post.objects.order_by("-pub_date")[:]
        context={
            "latest_posts":latest_posts
        }
        return render(request,"socialboard/index.html", context)
    else:
        return render(request,'socialboard/index.html')
        #display another page of sorts. perhaps redirect to login page? Or something of the sort.


def user_login(request):
    if request.POST:
        username=request.POST["username"]
        password=request.POST["password"]
        user = authenticate(request, username=username, password=password);
        if user is not None:
            if user.is_active:
                login(request,user)
                return redirect("/socialboard/")
                # redirect to success page
            else:
                return render(request,"<h1>Hello user is no longer active</h1>")

        else:
             return redirect("/socialboard/register")
            # return invalid pass or username.
        return render(request,"<h1>Hello user</h1>")
    else:
        return render(request, 'registration/login.html')

def register(request):
    if request.POST:
        username=request.POST["username"]
        password=request.POST["password"]
        email=request.POST["email"]
        user=User.objects.create_user(
            username=username,
            email=email,
            password=password)
        user.save()
        return redirect("/socialboard/")
    else:
        return HttpResponseNotFound("Hello")# can insert a page here

def create(request):
    if request.POST:
        title=request.POST["title"]
        content=request.POST["content"]
        user= request.user
        print(title,content, user)
        form =Post(
            title=title,
            pub_date=timezone.now(),
            content=content,
            author=user
        )
        form.save()

       # Do I need to ad a catch for an error here, how would I do this

        return redirect("/socialboard/")
    else:
        return HttpResponseNotFound("Hello")# can insert a page here
def data(request):

    posts= Post.objects.order_by("-pub_date")[:]
    """data=[]
    for post in posts:
        comments=Comments.objects.filter(id=post.id)
        object={
            "title":post.title,
            "content":post.content,
            "author":post.author,
            "comments": list(comments)
        }
        data.append(object)"""
    posts=serializers.serialize("json",posts)

    return HttpResponse(posts)
    #posts=model_to_dict(posts)
    #return HttpResponse(json.simplejson.dumps(posts))
def getcomments(request):
    #I am not sure of how to pass parameters... hmmmm
    comments=Comments.objects.all()
    comments=serializers.serialize("json",comments)
    return HttpResponse(comments)
def hear_comments(request):
    if request.is_ajax():
        content=request.POST.get("content","")
        id=request.POST.get("id","")
        user=request.user
        comment=Comments(
            post_id=id,
            pub_date=timezone.now(),
            content=content,
            author=user
        )
        comment.save()
    return redirect("/socialboard/")

