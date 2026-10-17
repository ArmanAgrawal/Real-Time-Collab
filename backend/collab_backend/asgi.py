import os

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "collab_backend.settings"
)

import django
django.setup()

from django.core.asgi import get_asgi_application

from channels.routing import (
    ProtocolTypeRouter,
    URLRouter
)
from collab_backend.middleware import JwtAuthMiddleware


import presentations.routing
import code_editor.routing


application = ProtocolTypeRouter({

    "http": get_asgi_application(),

    "websocket": JwtAuthMiddleware(

        URLRouter(

            presentations.routing.websocket_urlpatterns
            +
            code_editor.routing.websocket_urlpatterns
        )
    ),
})