import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from workspaces.models import Document, DocumentMember

User = get_user_model()

class DocumentConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        try:
            # 1. Extract IDs and User
            self.document_id = self.scope['url_route']['kwargs']['document_id']
            self.user = self.scope['user']
            
            print(f"DEBUG: WS Connection Attempt - User: {self.user}, Doc: {self.document_id}")

            # 2. Check Authentication (Handled by your TokenAuthMiddleware)
            if self.user.is_anonymous:
                print("DEBUG: Connection Rejected - User is Anonymous")
                await self.close(code=4001)
                return
            
            # 3. Verify Document Membership
            has_access = await self.check_document_access()
            if not has_access:
                print(f"DEBUG: Connection Rejected - User {self.user.id} has no access to {self.document_id}")
                await self.close(code=4003)
                return
            
            self.room_group_name = f'document_{self.document_id}'
            
            # 4. Join the group
            await self.channel_layer.group_add(
                self.room_group_name,
                self.channel_name
            )
            
            # 5. Accept the connection
            await self.accept()
            print(f"DEBUG: WS Connected successfully for {self.user.username}")
            
            # 6. Update user presence and notify others
            await self.update_presence(online=True)
            
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_joined',
                    'user_id': str(self.user.id),
                    'username': self.user.username,
                }
            )
        except Exception as e:
            # This logs the EXACT error causing the 1006 in your terminal
            print(f"CRITICAL ERROR in WebSocket connect: {str(e)}")
            await self.close()

    async def disconnect(self, close_code):
        print(f"DEBUG: WS Disconnected for {self.user}. Code: {close_code}")
        
        if hasattr(self, 'room_group_name'):
            # Leave room group
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name
            )
            
            # Update user presence
            await self.update_presence(online=False)
            
            # Notify others
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'user_left',
                    'user_id': str(self.user.id),
                }
            )

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'cursor_move':
                await self.update_cursor_position(data.get('position'))
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'cursor_moved',
                        'user_id': str(self.user.id),
                        'username': self.user.username,
                        'position': data.get('position'),
                    }
                )
            
            elif message_type == 'text_change':
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'text_changed',
                        'user_id': str(self.user.id),
                        'username': self.user.username,
                        'operations': data.get('operations', []),
                        'version': data.get('version'),
                    }
                )
            
            elif message_type == 'selection_change':
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        'type': 'selection_changed',
                        'user_id': str(self.user.id),
                        'username': self.user.username,
                        'selection': data.get('selection'),
                    }
                )
        except Exception as e:
            print(f"ERROR in WS receive: {str(e)}")

    # Group message handlers
    async def user_joined(self, event):
        await self.send(text_data=json.dumps(event))

    async def user_left(self, event):
        await self.send(text_data=json.dumps(event))

    async def cursor_moved(self, event):
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps(event))

    async def text_changed(self, event):
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps(event))

    async def selection_changed(self, event):
        if event['user_id'] != str(self.user.id):
            await self.send(text_data=json.dumps(event))

    # Database Helpers
    @database_sync_to_async
    def check_document_access(self):
        try:
            # Check if user is a member of the document
            return DocumentMember.objects.filter(
                document_id=self.document_id, 
                user=self.user
            ).exists()
        except Exception as e:
            print(f"DB Error in check_document_access: {e}")
            return False
    
    @database_sync_to_async
    def update_presence(self, online):
        try:
            DocumentMember.objects.filter(
                document_id=self.document_id, 
                user=self.user
            ).update(is_online=online)
        except Exception as e:
            print(f"DB Error in update_presence: {e}")
    
    @database_sync_to_async
    def update_cursor_position(self, position):
        try:
            DocumentMember.objects.filter(
                document_id=self.document_id, 
                user=self.user
            ).update(cursor_position=position)
        except Exception as e:
            print(f"DB Error in update_cursor_position: {e}")