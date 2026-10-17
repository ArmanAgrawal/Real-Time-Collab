from rest_framework import serializers
from .models import (
    Document,
    Presentation,
    Slide,
    SlideElement,
    PresentationChat
)

class DocumentSerializer(serializers.ModelSerializer):

    presentation_id = serializers.SerializerMethodField()

    code_document_id = serializers.SerializerMethodField()

    class Meta:
        model = Document

        fields = [
            "id",
            "title",
            "document_type",
            "presentation_id",
            "code_document_id"
        ]

    def get_presentation_id(self, obj):

        try:
            return obj.presentation.id

        except:
            return None

    def get_code_document_id(self, obj):

        try:
            return obj.code_document.id

        except:
            return None

class PresentationSerializer(serializers.ModelSerializer):

    document_type = serializers.CharField(source  = "document.document_type", read_only=True)

    class Meta:
        model = Presentation

        fields = [  
            "id",
            "title",
            "created_by",
            "created_at",
            "updated_at",
            "document",
            "document_type"
        ]

        read_only_fields = [
            "created_by",
            "created_at",
            "updated_at"
        ]


class SlideSerializer(serializers.ModelSerializer):

    class Meta:
        model = Slide
        fields = "__all__"
        read_only_fields = ["created_at", "order"]


class SlideElementSerializer(serializers.ModelSerializer):

    class Meta:
        model = SlideElement
        fields = "__all__"
        read_only_fields = ["created_at", "updated_at"]


class SlideElementNestedSerializer(serializers.ModelSerializer):

    class Meta:
        model = SlideElement
        fields = "__all__"
        exclude = ["slide"]


class SlideNestedSerializer(serializers.ModelSerializer):

    elements = serializers.SerializerMethodField()

    class Meta:
        model = Slide

        fields = [
            "id",
            "order",
            "background_color",
            "created_at",
            "elements"
        ]

    def get_elements(self, obj):

        elements = obj.elements.all().order_by("z_index")

        return SlideElementSerializer(
            elements,
            many=True
        ).data


class PresentationFullSerializer(serializers.ModelSerializer):

    slides = serializers.SerializerMethodField()

    class Meta:
        model = Presentation

        fields = [
            "id",
            "title",
            "created_at",
            "updated_at",
            "slides"
        ]

    def get_slides(self, obj):

        slides = obj.slides.all().order_by("order")

        return SlideNestedSerializer(
            slides,
            many=True
        ).data


class ChatSerializer(serializers.ModelSerializer):

    user = serializers.CharField(
        source="user.username"
    )

    class Meta:
        model = PresentationChat

        fields = [
            "id",
            "message",
            "user",
            "created_at"
        ]