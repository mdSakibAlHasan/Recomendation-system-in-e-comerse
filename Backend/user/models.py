from django.db import models
# from product.models import Product

#User
class User (models.Model):
    GeneralUser = 'G'
    SuperUser = 'S'

    USER_TYPE = [
        (GeneralUser, 'GeneralUser'),
        (SuperUser, 'SuperUser'),
    ]
    id = models.AutoField(primary_key = True)
    username = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)
    avatar = models.ImageField(null=True)
    create_time = models.DateTimeField(auto_now=True)
    userType = models.CharField(max_length=1, choices=USER_TYPE, default=GeneralUser)

    # liked_products = models.ManyToManyField('product.Product', related_name='liked_by_users', blank=True) 
    # disliked_products = models.ManyToManyField('product.Product', related_name='disliked_by_users', blank=True) 
    # viewed_products = models.ManyToManyField('product.Product', related_name='viewed_by_users', blank=True) 

    def __str__(self):
        return self.username

# #User Address
# class Address(models.Model):
#     user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='product ID')
#     address1 = models.CharField(max_length=200)
#     address2 = models.CharField(max_length=200)
