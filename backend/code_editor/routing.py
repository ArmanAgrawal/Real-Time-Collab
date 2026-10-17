from django.urls import re_path

from .consumers import CodeEditorConsumer


websocket_urlpatterns = [

    re_path(
        r"ws/code/(?P<document_id>\d+)/$",
        CodeEditorConsumer.as_asgi(),
    ),
]