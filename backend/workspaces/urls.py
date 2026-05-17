# from rest_framework_nested import routers
# from django.urls import path, include
# from .views import WorkspaceViewSet
# from presentations.views import PresentationViewSet

# router = routers.DefaultRouter()
# router.register(r'workspaces', WorkspaceViewSet, basename='workspace')

# # Nested: Workspace → Presentations
# workspace_router = routers.NestedDefaultRouter(
#     router,
#     r'workspaces',
#     lookup='workspace'
# )

# workspace_router.register(
#     r'presentations',
#     PresentationViewSet,
#     basename='workspace-presentations'
# )

# urlpatterns = [
#     path('', include(router.urls)),
#     path('', include(workspace_router.urls)),
# ]