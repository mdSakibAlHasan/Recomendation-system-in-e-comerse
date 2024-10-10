from django.db import models
from django.db.models import Avg
from user.models import User 

#mina start 
class Category(models.Model):
    name=models.CharField(max_length=30,verbose_name=("Name of Category"))
    image= models.ImageField(upload_to='category/',verbose_name=("Image"), blank=True, null=True)
    catParent=models.ForeignKey('self',limit_choices_to={'catParent__isnull':True}, on_delete=models.CASCADE,blank=True,null=True,verbose_name=("Category Parent"))
    def __str__(self):
        return self.name

class Brand(models.Model):
    name=models.CharField(max_length=30,verbose_name=("Name of Brand"))
    categoryID = models.ForeignKey(Category, on_delete=models.CASCADE,verbose_name=("Category"))
    def __str__(self):
        return str(self.name)
#mina end
class Product(models.Model):
    name = models.CharField(max_length=30, verbose_name=("Product Name"))
    description = models.TextField(verbose_name=("Product Description"))
    model = models.CharField(max_length=30, verbose_name=("Product Model"))
    price = models.DecimalField(decimal_places=2, max_digits=12,verbose_name=("Product Price"))
    stock_items = models.IntegerField(verbose_name=("Product Items in Stock"))
    BID = models.ForeignKey(Brand, on_delete=models.CASCADE, verbose_name=("Brand ID"))
    CategoryID=models.ForeignKey(Category, on_delete=models.CASCADE, verbose_name=("Category ID"))
    base_view = models.ImageField(verbose_name=("Product  Image"), blank=True , null=True)
    average_rating = models.DecimalField(default=0.0,decimal_places=1, max_digits=2,verbose_name=("Average Rating"))
    like = models.IntegerField(default=0,verbose_name=("Like by User"))
    disLike = models.IntegerField(default=0,verbose_name=("Dislike by User"))
    item_view = models.IntegerField(default=0,verbose_name=("Product Items total views"))
    item_puchases = models.IntegerField(default=0,verbose_name=("Product Items total puchese"))
    def __str__(self):
        return str(self.name)

class ProductPicture(models.Model):
    productId = models.ForeignKey(Product, null=True, on_delete=models.CASCADE, verbose_name="Product ID")
    front_view = models.ImageField(verbose_name=("Product Front Image"))
    top_view = models.ImageField(verbose_name=("Product Top Image"))
    side_view = models.ImageField(verbose_name=("Product Side Image"))
    inner_view = models.ImageField(verbose_name=("Product Inner Image"))

class ProductComment(models.Model):
    PID = models.ForeignKey(Product, on_delete=models.CASCADE, verbose_name=("Product ID"))
    UID = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=("User ID"))
    comment = models.TextField(verbose_name=("Product Comment"))
    review = models.DecimalField(decimal_places=1,max_digits=2, verbose_name=("Product Stars Review"))
    create_time = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):            #update avarage review
        super().save(*args, **kwargs)
        product = self.PID
        average_rating = ProductComment.objects.filter(PID=product).aggregate(Avg('review'))['review__avg']
        product.average_rating = average_rating or 0.0
        product.save()
