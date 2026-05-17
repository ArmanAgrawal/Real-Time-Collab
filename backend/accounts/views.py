from google.oauth2 import id_token
from google.auth.transport import requests
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import generics,status,permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth import get_user_model
from .serializers import RegisterSerializer,UserSerializer,CustomTokenObtainPairSerializer
# Create your views here.

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer   

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserProfileView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user
    

class CheckAuthView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self,request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({
            'isAuthenticated':True,
            'user':serializer.data
        })

class GoogleLoginView(APIView):
    permission_classes = [AllowAny]
    
    def post(self,request):
        token = request.data.get("token")

        if not token : 
            return Response(
                {"error":"Token not provided"},
                status=status.HTTP_400_BAD_REQUEST
            )
        try :
            idinfo = id_token.verify_oauth2_token(
                token,
                requests.Request(),
                settings.GOOGLE_CLIENT_ID
            )

            email = idinfo.get("email")
            first_name = idinfo.get("given_name","")
            last_name = idinfo.get("family_name","")
            picture = idinfo.get("picture")

            user,created = User.objects.get_or_create(
                email = email,
                defaults={
                    "username":email.split("@")[0],
                    "first_name":first_name,
                    "last_name":last_name,
                    "profile_picture":picture
                }
            )
            if not created and picture and not user.profile_picture:
                user.profile_picture = picture
                user.save()
            refresh = RefreshToken.for_user(user)

            return Response({
                "refresh":str(refresh),
                "access":str(refresh.access_token),
                "user":{
                    "id":user.id,
                    "email":user.email,
                    "username":user.username,
                    "first_name":user.first_name,
                    "last_name":user.last_name,
                    "profile_picture":picture,
                }
            })
        except ValueError:
            return Response(
                {"error":"Invalid Google token"},
                status=status.HTTP_400_BAD_REQUEST
            )