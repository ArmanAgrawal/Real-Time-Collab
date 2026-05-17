from django.contrib.auth.models import AnonymousUser
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken

User = get_user_model()

@database_sync_to_async
def get_user_from_token(token_string):
    try:
        # Decode the JWT token
        access_token = AccessToken(token_string)
        user_id = access_token['user_id']
        return User.objects.get(id=user_id)
    except Exception:
        return AnonymousUser()

class TokenAuthMiddleware:
    def __init__(self, inner):
        self.inner = inner
        
async def __call__(self, scope, receive, send):
    query_string = scope.get("query_string", b"").decode()
    query_params = dict(qc.split("=") for qc in query_string.split("&") if "=" in qc)
    token = query_params.get("token")
    
    if token:
        user = await get_user_from_token(token)
        scope['user'] = user
        print(f"DEBUG: WebSocket Auth successful for user: {user}") # ADD THIS
    else:
        scope['user'] = AnonymousUser()
        print("DEBUG: WebSocket Auth failed - No token found") # ADD THIS
        
    return await self.inner(scope, receive, send)