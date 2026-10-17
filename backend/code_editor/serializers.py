from rest_framework import serializers
from .models import CodeDocument


class CodeDocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = CodeDocument
        fields = "__all__"
        read_only_fields = [
            "document"
        ]