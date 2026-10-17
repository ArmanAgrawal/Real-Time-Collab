from django.db import models
from presentations.models import Document


class CodeDocument(models.Model):

    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name="code_document"
    )

    code = models.TextField(blank=True)

    language = models.CharField(
        max_length=50,
        default="javascript"
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.document.title