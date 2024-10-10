from recomendation.models import ViewActivity
from .models import Product
from user.models import User
from django.utils import timezone
from Backend.utils import getUserId
from django.core.exceptions import ObjectDoesNotExist

def write_user_visit_product(self):
    id = self.kwargs['id'] 
    user_id = getUserId(self.request) 
    try:
        product = Product.objects.get(id=id)
        if user_id:
            user = User.objects.get(id = user_id)
            view_activity, created = ViewActivity.objects.get_or_create(
                UID=user,
                PID=product,
                defaults={'times_vist': 1, 'last_time': timezone.now()}
            )

            if not created:
                view_activity.times_vist += 1
                view_activity.last_time = timezone.now()
                view_activity.save()

        product.item_view += 1
        product.save()

    except Product.DoesNotExist:
        raise ValueError("Product does not exist.")