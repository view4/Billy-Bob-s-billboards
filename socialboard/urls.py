from django.conf.urls import url
from . import views
from django.contrib.auth.views import login,logout


app_name="socialboard"
urlpatterns=[
    url(r'^$', views.index, name="index"),
    url(r'^login/$', views.user_login, name="user_login"),
    url(r'^register/$', views.register, name="register"),
    url(r'^create/$', views.create, name="create"),
    url(r'^data/$', views.data, name="data"),
    url(r'^getcomments/$', views.getcomments, name="getcomments"),
    url(r'^hear-comments/$', views.hear_comments, name="hear-comments")


]
