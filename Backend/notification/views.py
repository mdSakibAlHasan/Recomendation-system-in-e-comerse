# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from Backend.utils import getUserId
from .models import Notification
from .serializers import NotificationSerializer


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def send_notification(message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        'notifications',
        {
            'type': 'send_notification',
            'message': message,
        }
    )
    


import time
from django.core.management.base import BaseCommand
# from consumers import send_notification

class Command(BaseCommand):
    help = "Send notifications every minute"

    def handle(self, *args, **kwargs):
        while True:
            message = "This is a periodic notification sent every minute."
            send_notification(message)
            self.stdout.write("Notification sent!")
            time.sleep(60)  # Wait for 1 minute

class NotificationView(APIView):

    def get(self, request):
        user_id = getUserId(request)
        if user_id == None:
            return Response({"message":"user not found"}, status=status.HTTP_403_FORBIDDEN)
        else:
            notifications = Notification.objects.filter(user_id=user_id).order_by('-created_at')
            serializer = NotificationSerializer(notifications, many=True)
            return Response(serializer.data)

    # def post(self, request):
    #     data = request.data
    #     data['user'] = request.user.id
    #     serializer = NotificationSerializer(data=data)
    #     if serializer.is_valid():
    #         serializer.save()
    #         return Response(serializer.data, status=201)
    #     return Response(serializer.errors, status=400)
    
    def patch(self, request, notification_id):
        """
        Marks the notification as read (changes is_read to True).
        """
        try:
            user_id = getUserId(request)
            if user_id == None:
                return Response({"message":"user not found"}, status=status.HTTP_403_FORBIDDEN)
            else:
                notification = Notification.objects.get(id=notification_id, user_id=user_id)
                notification.is_read = True
                notification.save()
                send_notification("THis is send from mark as read")
                return Response({'status': 'Notification marked as read'}, status=200)
        except Notification.DoesNotExist:
            print("Here are call")
            return Response({'error': 'Notification not found'}, status=404)


def send_notifications(user, message,link):      #create new notification from internal
    Notification.objects.create(user_id=user, message=message, link=link)
    
    
class NotificationCountView(ListAPIView):
    def get(self, request, *args, **kwargs):
        user_id = getUserId(request)
        if user_id == None:
            return Response({}, status=status.HTTP_403_FORBIDDEN)
        else:
            cart_count = Notification.objects.filter(user_id=user_id, is_read = False).count()
            return Response({'total_notification': cart_count})