from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect, Http404
from django.shortcuts import render
from django.urls import reverse
from django.shortcuts import redirect
from .forms import NewPostForm
from .models import User, Post
from django.contrib import messages
from django.http import JsonResponse

@login_required(login_url="/login")
def index(request):
    return render(request, "network/index.html", {
        "form": NewPostForm()
        # "posts": Post.objects.all("").order_by('-timestamp')
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
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


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
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")


@login_required(login_url="/login")
def new_post(request):

    if request.method == "POST":
        form = NewPostForm(request.POST)

        if form.is_valid():
            content = form.cleaned_data["content"]


            try:
                post = Post.objects.create(content=content, poster=request.user)
                post.save()

                messages.success(request, 'New Post Added.')
                return redirect("index")                
            except IntegrityError:
                # TODO render(request, "error/")
                pass
        else:
            # TODO 
            # messages.warning(request, 'This is warning. Please type a price to bid that is greater than the current bid if any or the initial price.')
            # return redirect("listing", listing_id=listing_id)
            pass
    else:
        # TODO 
        # messages.danger(request, 'This is warning. Please type a price to bid that is greater than the current bid if any or the initial price.')
        # return redirect("listing", listing_id=listing_id)
        pass


@login_required(login_url="/login")
def profile_page(request, user_id):

    try:
        user = User.objects.get(pk=user_id)
    except UnboundLocalError or ValueError:
        # TODO
        raise Http404("User not found.")
    except User.DoesNotExist:
            return render(request, "error/404.html", {
                "message": "404",
                "title": "404 error"
            })

    posts = Post.objects.filter(poster=user).order_by("-timestamp").all()
    
    # print(user in request.user.following.all())
    return render(request, "network/profile.html", {
        "user_info": user,
        "posts": posts,
        "isfollow": user in request.user.following.all()
    })


def todo():
    pass


# APIs
@login_required(login_url="/login")
def load_Posts(request, action):
    """Getting all the posts"""

    if action == "all":
        posts = Post.objects.all().order_by("-timestamp")

        return JsonResponse([ post.serialize(request.user) for post in posts ], safe=False)
    elif action == "profile":
        pass
    elif action == "following":
        pass
    else:
        return JsonResponse({"error": "Invalid request."}, status=400)
    

@login_required(login_url="/login")
def follow(request, follower_id):
    """Follow a user."""

    try:
        user = User.objects.get(pk=follower_id)
    except UnboundLocalError or ValueError:
        raise Http404("User not found.")
    except User.DoesNotExist:
            return render(request, "error/404.html", {
                "message": "404",
                "title": "404 error"
            })
    
    if request.user.id != follower_id:
        user.follower.add(request.user)
        request.user.following.add(user)

        return JsonResponse({"message": "success"}, status=200)
    else:
        # TODO
        return JsonResponse({"message": "fail"}, status=400)


def todo():
    pass


def todo():
    pass