from django.urls import re_path
from . import consumers

websocket_urls = [
    re_path(r'clock', consumers.ClockConsumer.as_asgi())
]