from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
from time import time

class ClockConsumer(WebsocketConsumer):
    def connect(self):
        self.group = 'global'

        async_to_sync(self.channel_layer.group_add)(self.group, self.channel_name)
        self.accept()

    def receive(self, text_data):
        if(text_data == 'requestTime'):
            async_to_sync(self.channel_layer.group_send)(self.group, {
                'type': 'broadcast_time',
                'time': f"{int(time() * 1000)}"
            })

    def broadcast_time(self, event):
        time = event['time']
        self.send(text_data=time)