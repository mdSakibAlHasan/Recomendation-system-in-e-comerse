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

    def save(self, *args, **kwargs):
        is_new = self._state.adding
        super().save(*args, **kwargs)
        
        product = self.PID
        if is_new:
            if self.preference == '1':
                product.like += 1
            else:
                product.disLike += 1
        elif not is_new:
            if self.preference == '1':
                product.like += 1
                product.disLike -= 1
            else: 
                product.like -= 1
                product.disLike += 1
        product.save()

    def delete(self, *args, **kwargs):
        product = self.PID
        if self.preference == 1:  
            product.like -= 1
        else:
            product.disLike -= 1
        product.save()
        super().delete(*args, **kwargs)
