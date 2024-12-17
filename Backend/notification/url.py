from django.urls import path
from .views import NotificationCountView, NotificationView

urlpatterns = [
    path('', NotificationView.as_view(), name='notifications'),
    path('<int:notification_id>', NotificationView.as_view(), name='mark_notification_read'),
    path('count', NotificationCountView.as_view(), name='total_notification_read_counter'),
]