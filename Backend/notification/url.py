from django.urls import path
from .views import NotificationView

urlpatterns = [
    path('', NotificationView.as_view(), name='notifications'),
    path('<int:notification_id>', NotificationView.as_view(), name='mark_notification_read'),
]