import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import PresentationChat


class PresentationConsumer(AsyncWebsocketConsumer):
    active_user = {}

    async def connect(self):
        print("WebSocket connect request")

        self.presentation_id = self.scope["url_route"]["kwargs"]["presentation_id"]
        self.room_group_name = f"presentation_{self.presentation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        self.active_user.setdefault(self.presentation_id, set())
        self.active_user[self.presentation_id].add(self.scope["user"].username)

        await self.accept()

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "presence_update",
                "users": list(self.active_user[self.presentation_id])
            }
        )

        print("WebSocket connected")

    async def disconnect(self, close_code):
        print("WebSocket disconnected")

        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

        if self.presentation_id in self.active_user:
            self.active_user[self.presentation_id].discard(self.scope["user"].username)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "presence_update",
                    "users": list(self.active_user[self.presentation_id])
                }
            )

    @database_sync_to_async
    def save_chat(self, payload):
        PresentationChat.objects.create(
            presentation_id=self.presentation_id,
            user=self.scope["user"],
            message=payload.get("message")
        )

    async def receive(self, text_data):
        data = json.loads(text_data)

        message_type = data.get("type")
        payload = data.get("payload") or data.get("data", {})

        valid_types = [
            "MOVE", "TEXT_EDIT", "RESIZE", "CURSOR",
            "STATE_SYNC", "CHAT", "TYPING",
            "element-created",
            "element-updated",
            "element-deleted",
            "element-locked",
            "element-unlocked"
        ]

        if message_type not in valid_types:
            print("Invalid message type:", message_type)
            return

        print(f"[WS] {message_type}")

        # HANDLE ELEMENT CREATION/UPDATES/DELETION
        if message_type.startswith("element-"):
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "broadcast",
                    "message_type": message_type,
                    "payload": data,
                    "sender": self.channel_name
                }
            )
            return

        if message_type == "CHAT":
            await self.save_chat(payload)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "broadcast",
                    "message_type": "CHAT",
                    "payload": {
                        "message": payload.get("message"),
                        "user": self.scope["user"].username
                    },
                    "sender": self.channel_name
                }
            )
            return

        if message_type == "TYPING":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_event",
                    "user": self.scope["user"].username,
                    "sender": self.channel_name
                }
            )
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "broadcast",
                "message_type": message_type,
                "payload": payload,
                "sender": self.channel_name
            }
        )

    async def broadcast(self, event):
        await self.send(text_data=json.dumps({
            "type": event["message_type"],
            "payload": event["payload"]
        }))

    async def presence_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "PRESENCE",
            "users": event["users"]
        }))

    async def typing_event(self, event):
        if event["sender"] == self.channel_name:
            return

        await self.send(text_data=json.dumps({
            "type": "TYPING",
            "user": event["user"]
        }))