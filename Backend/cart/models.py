from django.db import models

from user.models import User


class Wishlist(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user ID')
    product = models.ForeignKey('product.Product', on_delete=models.CASCADE, verbose_name='product ID')


#cart
class Cart(models.Model):
    PENDING = 'P'
    CANCELED = 'C'
    ORDERED = 'O'

    CART_STATUS = [
        (PENDING, 'Pending'),
        (CANCELED, 'Cenceled'),
        (ORDERED, 'Ordered'),
    ]
    PID = models.ForeignKey('product.Product', on_delete=models.CASCADE , verbose_name='product ID')
    UID = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user ID')
    quantity = models.IntegerField(default=1)
    create_time = models.DateTimeField(auto_now=True)
    status = models.CharField(
        max_length=1, choices=CART_STATUS, default=PENDING)

    def save(self, *args, **kwargs):
        if self.status == self.ORDERED:
            product = self.PID
            product.item_puchases += self.quantity  
            product.save() 

        super(Cart, self).save(*args, **kwargs) 