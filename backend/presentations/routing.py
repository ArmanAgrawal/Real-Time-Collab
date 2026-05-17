from django.urls import re_path
from .consumers import PresentationConsumer

websocket_urlpatterns = [
    re_path(
        r"ws/presentations/(?P<presentation_id>\d+)/$",
        PresentationConsumer.as_asgi(),
    ),
]