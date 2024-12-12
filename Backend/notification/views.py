# views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from Backend.utils import getUserId
from .models import Notification
from .serializers import NotificationSerializer

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
                return Response({'status': 'Notification marked as read'}, status=200)
        except Notification.DoesNotExist:
            return Response({'error': 'Notification not found'}, status=404)


def send_notification(user, message,link):      #create new notification from internal
    Notification.objects.create(user=user, message=message, link=link)