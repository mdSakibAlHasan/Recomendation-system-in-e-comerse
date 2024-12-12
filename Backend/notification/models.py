from django.db import models
from django.contrib.auth.models import User

class Notification(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name='user ID')
    message = models.TextField(verbose_name=("Notification message"))
    link = models.URLField(max_length=500, blank=True, null=True, verbose_name=("Redirection link"))
    is_read = models.BooleanField(default=False,verbose_name=("status"))
    created_at = models.DateTimeField(auto_now_add=True,verbose_name=("Sending time"))
