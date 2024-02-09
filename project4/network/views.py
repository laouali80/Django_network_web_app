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
import json
from django.views.decorators.csrf import csrf_exempt


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
def profile_page(request, user_name):

    try:
        user = User.objects.get(username=user_name)
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


@login_required(login_url="/login")
def followings(request):
    return render(request, "network/followings.html")


# APIs

@login_required(login_url="/login")
def load_Posts(request, action):
    """Getting all the posts"""

    if action == "all":
        posts = Post.objects.all().exclude(poster=request.user).order_by("-timestamp")

        return JsonResponse([ post.serialize(request.user) for post in posts ], safe=False)
    
    elif action == "followings":
        users_follow = request.user.following.all()

        posts = []
        for post_set in users_follow:
            set_posts = post_set.posts.all()
            
            for post in set_posts:
                
                serialize = post.serialize(request.user)
                posts.append(serialize)
            
        return JsonResponse(sorted(posts, key=lambda d: d['timestamp'], reverse=True), safe=False)

    else:
        return JsonResponse({"error": "Invalid request."}, status=400)
    

   
@csrf_exempt
@login_required(login_url="/login")
def action(request, follower_id):
    """Follow and unfollow a user."""

    if request.method == 'PUT':

        data = json.loads(request.body)

        if data.get('action') == 'follow':
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

                return JsonResponse({"message": "Success follow."}, status=200)
            else:
                # error 400 if the user wants try to follow him/her-self.
                return JsonResponse({"message": "Bad request"}, status=400)
            
        else:
            # if there is no action in the demand.
            return HttpResponse(status=204)
    
    elif request.method == 'DELETE':

        data = json.loads(request.body)

        if data.get('action') == 'unfollow':

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
                user.follower.remove(request.user)
                request.user.following.remove(user)

                return JsonResponse({"message": "Success unfollow"}, status=200)
            else:
                # error 400 if the user wants try to unfollow him/her-self.
                return JsonResponse({"message": "Bad request."}, status=400)
            
        else:
            # if there is no action in the demand.
            return HttpResponse(status=204)
        
    else:
        #  Incorrect request from the user.
        return JsonResponse({
            "error": "Something wrong happen."
        }, status=400)


@csrf_exempt
@login_required(login_url="/login")
def action2(request, post_id):
    """Like and Dislike a post."""
    
    if request.method == 'PUT':

        data = json.loads(request.body)

        if data.get('action') == 'like':
            try:
                post = Post.objects.get(pk=post_id)
            except UnboundLocalError or ValueError:
                raise Http404("Post not found.")
            except User.DoesNotExist:
                    return render(request, "error/404.html", {
                        "message": "404",
                        "title": "404 error"
                    })
            
            like = post.likes.add(request.user)
            
            
            return JsonResponse({"message": "Success Like."}, status=200)
            
        elif data.get('action') == 'unlike':
            try:
                post = Post.objects.get(pk=post_id)
            except UnboundLocalError or ValueError:
                raise Http404("Post not found.")
            except User.DoesNotExist:
                    return render(request, "error/404.html", {
                        "message": "404",
                        "title": "404 error"
                    })
            
            like = post.likes.remove(request.user)

            return JsonResponse({"message": "Success Unlike."}, status=200)
                 
        else:
            # if there is no action in the demand.
            return HttpResponse(status=204)