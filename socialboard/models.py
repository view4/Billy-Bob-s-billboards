from django.db import models

# Create your models here.
class Post (models.Model):
    title=models.CharField(max_length=120)
    pub_date=models.DateTimeField("date published")
    content=models.CharField(max_length=500)
    author=models.CharField(max_length=24)
    def __str__(self):
        return self.title;

class Comments (models.Model):
    post=models.ForeignKey(Post, on_delete=models.CASCADE, null=True)
    pub_date=models.DateTimeField("date published")
    content=models.CharField(max_length=500)
    author=models.CharField(max_length=24)
    def __str__(self):
        return self.content;





