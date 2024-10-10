from django.db import models
from user.models import User
from product.models import Product



class ViewActivity(models.Model):
    PID = models.ForeignKey(Product, on_delete=models.CASCADE , verbose_name='product ID')
    UID = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user ID')
    times_vist = models.IntegerField(default=1)
    last_time = models.DateTimeField(auto_now=True)


class SearchActivity(models.Model):
    UID = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user ID', blank=True , null=True)
    keyword = models.TextField(verbose_name=("Search keyword"))


class LikedProduct(models.Model):
    PID = models.ForeignKey(Product, on_delete=models.CASCADE , verbose_name='product ID')
    UID = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user ID')
    preference = models.IntegerField(default=1)
