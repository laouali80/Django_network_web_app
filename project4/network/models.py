from django.contrib.auth.models import AbstractUser
from django.db import models
# from django.utils import timezone


class User(AbstractUser):
    follower = models.ManyToManyField("User", related_name="followers")
    following = models.ManyToManyField("User", related_name="followings")


class Post(models.Model):
    content = models.CharField(max_length=100)
    poster = models.ForeignKey('User', on_delete=models.CASCADE, related_name='posts')
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Post ({self.id}) by {self.poster}."

    def serialize(self, request_user):
        # print("heeeeeeeeeeeeeeeeeeeeeeeee", self.poster.following.all())
        return {
            "id": self.id,
            "content": self.content,
            "poster": self.poster.username,
            "poster_id": self.poster.id,
            "timestamp": self.timestamp.strftime("%b %d, %Y, %I:%M %p"),
            "isfollow": request_user in self.poster.follower.all()
        }

class Like(models.Model):
    post = models.ForeignKey('Post', on_delete=models.CASCADE)
    count = models.IntegerField()

