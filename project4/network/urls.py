
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    path("new_post", views.new_post, name="new_post"),
    path("profile/<int:user_id>", views.profile_page, name="profile"),
    path("followings", views.followings, name="followings"),

    # APIs Views
    path("load_Posts/<str:action>", views.load_Posts, name="load_Posts"),
    path("action/<int:follower_id>", views.action, name="action"),

]
