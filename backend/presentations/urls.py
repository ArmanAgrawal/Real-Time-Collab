# from rest_framework_nested import routers
# from django.urls import path, include
# from .views import SlideViewSet, SlideElementViewSet

# # This router will be connected from workspace level
# router = routers.DefaultRouter()

# # Slides nested under presentations
# presentation_router = routers.NestedDefaultRouter(
#     router,
#     r'presentations',
#     lookup='presentation'
# )
# presentation_router.register(
#     r'slides',
#     SlideViewSet,
#     basename='presentation-slides'
# )

# # Elements nested under slides
# slide_router = routers.NestedDefaultRouter(
#     presentation_router,
#     r'slides',
#     lookup='slide'
# )
# slide_router.register(
#     r'elements',
#     SlideElementViewSet,
#     basename='slide-elements'
# )

# urlpatterns = [
#     path('', include(presentation_router.urls)),
#     path('', include(slide_router.urls)),
# ]