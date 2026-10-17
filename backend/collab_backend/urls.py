"""
URL configuration for collab_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from rest_framework_nested import routers
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from workspaces.views import WorkspaceViewSet
from presentations.views import (
    PresentationViewSet,
    SlideViewSet,
    SlideElementViewSet,
    PresentationChat
)

# ROOT ROUTER
router = routers.DefaultRouter()
router.register(r'workspaces', WorkspaceViewSet, basename='workspace')

# NEST 1: Workspace → Presentations
workspace_router = routers.NestedDefaultRouter(
    router,
    r'workspaces',
    lookup='workspace'
)
workspace_router.register(
    r'presentations',
    PresentationViewSet,
    basename='workspace-presentations'
)

# NEST 2: Presentations → Slides
presentation_router = routers.NestedDefaultRouter(
    workspace_router,
    r'presentations',
    lookup='presentation'
)
presentation_router.register(
    r'slides',
    SlideViewSet,
    basename='presentation-slides'
)

# NEST 3: Slides → Elements
slide_router = routers.NestedDefaultRouter(
    presentation_router,
    r'slides',
    lookup='slide'
)
slide_router.register(
    r'elements',
    SlideElementViewSet,
    basename='slide-elements'
)

schema_view = get_schema_view(
   openapi.Info(
      title="Collab API",
      default_version='v1',
      description="Workspace + Presentation API Documentation",
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),

    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0)),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0)),

    path('api/auth/', include('accounts.urls')),

    path('api/', include(router.urls)),
    path('api/', include(workspace_router.urls)),
    path('api/', include(presentation_router.urls)),
    path('api/', include(slide_router.urls)),
    path("api/", include("code_editor.urls")),
]


if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)