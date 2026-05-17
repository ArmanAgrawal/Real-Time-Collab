from rest_framework import serializers
from .models import Presentation,Slide,SlideElement,PresentationChat


class PresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Presentation
        fields = [
            "id",
            "title",
            "workspace",
            "created_by",
            "created_at",
            "updated_at"
        ]
        read_only_fields = ["workspace","created_by","created_at","updated_at"]


class SlideSerializer(serializers.ModelSerializer):
    class Meta:
        model = Slide
        fields = "__all__"
        read_only_fields = ["created_at","order"]


class SlideElementSerializer(serializers.ModelSerializer):
    class Meta:
        model  = SlideElement
        fields = "__all__"
        read_only_fields = ["created_at","updated_at"]


class SlideElementNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = SlideElement
        fields = "__all__"
        exclude = ["slide"]

class SlideNestedSerializer(serializers.ModelSerializer):
    elements =serializers.SerializerMethodField()

    class Meta:
        model  = Slide
        fields = ["id","order","background_color","created_at","elements"]

    def get_elements(self,obj):
        elements = obj.elements.all().order_by("z_index")
        return SlideElementSerializer(elements,many = True).data


class PresentationFullSerializer(serializers.ModelSerializer):
    slides = serializers.SerializerMethodField()

    class Meta:
        model = Presentation
        fields = ["id","title","created_at","updated_at","slides"]

    def get_slides(self,obj):
        slides = obj.slides.all().order_by("order")
        return SlideNestedSerializer(slides,many = True).data


class ChatSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source="user.username")

    class Meta:
        model = PresentationChat
        fields = ["id","message","user","created_at"]



