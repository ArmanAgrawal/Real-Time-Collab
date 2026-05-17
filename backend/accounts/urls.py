from django.urls import path
from .views import RegisterView, CustomTokenObtainPairView, UserProfileView, CheckAuthView,GoogleLoginView
from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('login/google/', GoogleLoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('check-auth/', CheckAuthView.as_view(), name='check_auth'),
]

