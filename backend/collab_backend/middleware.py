from urllib.parse import parse_qs

from channels.middleware import BaseMiddleware

from rest_framework_simplejwt.tokens import AccessToken

from accounts.models import CustomUser


class JwtAuthMiddleware(BaseMiddleware):

    async def __call__(self, scope, receive, send):

        try:

            query_params = parse_qs(
                scope["query_string"].decode()
            )

            token = query_params.get("token")

            if token:

                token = token[0]

                access_token = AccessToken(token)

                user = await CustomUser.objects.aget(
                    id=access_token["user_id"]
                )

                scope["user"] = user

        except Exception as e:

            print("JWT Error:", e)

        return await super().__call__(
            scope,
            receive,
            send
        )