from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated

from .models import CodeDocument
from .serializers import CodeDocumentSerializer

from presentations.models import Document


class CodeDocumentViewSet(viewsets.ModelViewSet):

    serializer_class = CodeDocumentSerializer
    permission_classes = [IsAuthenticated]

    queryset = CodeDocument.objects.all()

    def perform_create(self, serializer):

        workspace_id = self.request.data.get("workspace")

        document = Document.objects.create(
            workspace_id=workspace_id,
            title=self.request.data.get("title"),
            document_type="code",
            created_by=self.request.user
        )

        serializer.save(
            document=document
        )