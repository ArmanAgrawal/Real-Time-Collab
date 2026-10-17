import json

from channels.generic.websocket import AsyncWebsocketConsumer

online_users = {}

class CodeEditorConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        self.document_id = self.scope["url_route"]["kwargs"]["document_id"]

        self.room_group_name = f"code_{self.document_id}"

        print(self.scope["user"])


        self.user = self.scope["user"]
        
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        if self.room_group_name not in online_users:
            online_users[self.room_group_name] = set()

        online_users[self.room_group_name].add(self.user.username)
        print("Online Users:", online_users)

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "active_users",
                "users": list(online_users.get(self.room_group_name, set())),
            }
        )
        print("Code WS Connected")

    async def disconnect(self, close_code):

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        if self.room_group_name in online_users:
            online_users[self.room_group_name].discard(self.user.username)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "active_users",
                    "users": list(online_users.get(self.room_group_name, set())),
                }
            )


        print("Code WS Disconnected")

    async def receive(self, text_data):

        data = json.loads(text_data)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "broadcast_code",
                "code": data.get("code"),
                "sender": self.channel_name
            }
        )

    async def broadcast_code(self, event):

        if event["sender"] == self.channel_name:
            return

        await self.send(text_data=json.dumps({
            "code": event["code"]
        }))

    async def active_users(self, event):
        await self.send(text_data=json.dumps({
            "type": "active_users",
            "users": event["users"]
        }))
