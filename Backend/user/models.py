from django.db import models

#User
class User (models.Model):
    id = models.AutoField(primary_key = True)
    username = models.CharField(max_length=20)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)
    avatar = models.ImageField(null=True)
    create_time = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.username

#User Address
class Address(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='product ID')
    address1 = models.CharField(max_length=200)
    address2 = models.CharField(max_length=200)
