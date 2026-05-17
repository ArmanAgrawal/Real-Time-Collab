import os
import django

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack

# ✅ SET SETTINGS FIRST
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "collab_backend.settings")

# ✅ THEN SETUP DJANGO
django.setup()

# ✅ THEN IMPORT YOUR ROUTING
import presentations.routing


application = ProtocolTypeRouter({
    "http": get_asgi_application(),

    "websocket": AuthMiddlewareStack(
        URLRouter(
            presentations.routing.websocket_urlpatterns
        )
    ),
})