import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from your_app.consumers import NotificationConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Backend.settings')

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter([
            # Define your WebSocket routes
            path("ws/notifications/", NotificationConsumer.as_asgi()),
        ])
    ),
})
