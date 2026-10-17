from rest_framework.routers import DefaultRouter

from .views import CodeDocumentViewSet

router = DefaultRouter()

router.register(
    "code-documents",
    CodeDocumentViewSet,
    basename="code-document"
)

urlpatterns = router.urls