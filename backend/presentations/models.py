from django.db import models
from django.conf import settings
from workspaces.models import Workspace

# Create your models here.
class Document(models.Model):

    DOCUMENT_TYPES = [
        ("ppt", "PPT"),
        ("code", "CODE"),
    ]

    workspace = models.ForeignKey(
        Workspace,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    title = models.CharField(max_length=255)

    document_type = models.CharField(
        max_length=20,
        choices=DOCUMENT_TYPES
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return self.title




class Presentation(models.Model):
    document = models.OneToOneField(
        Document,
        on_delete=models.CASCADE,
        related_name="presentation",
        null=True,
        blank=True
    )

    title = models.CharField(max_length=255)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_presentations"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(default=False)

    def __str__(self):
        return self.title
    

class Slide(models.Model):
    presentation = models.ForeignKey(
        Presentation,
        on_delete=models.CASCADE,
        related_name="slides"
    )
    order = models.PositiveIntegerField()
    background_color = models.CharField(max_length=20,default="#FFFFFF")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["order"]
        indexes = [
            models.Index(fields=["presentation","order"])
        ]

    def __str__(self):
        return f"Slide {self.order}-{self.presentation.title}"


class SlideElement(models.Model):
    ELEMENT_TYPES = [
        ("text","TEXT"),
        ("rectangle","Rectangle")
    ]

    slide = models.ForeignKey(
        Slide,
        on_delete=models.CASCADE,
        related_name="elements"
    )

    type = models.CharField(max_length=20,choices=ELEMENT_TYPES)

    x = models.FloatField(default=0)
    y = models.FloatField(default=0)
    width = models.FloatField(default=100)
    height = models.FloatField(default=100)
    rotation = models.FloatField(default=0)
    z_index = models.IntegerField(default=0)

    content = models.JSONField(default=dict,blank=True)
    style = models.JSONField(default=dict,blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.type} element on Slide {self.slide.id}"



class PresentationChat(models.Model):
    presentation = models.ForeignKey(
        Presentation,
        on_delete=models.CASCADE,
        related_name="chats"
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.message[:20]}"
    


class ChatSummary(models.Model):
    presentation = models.OneToOneField(
        Presentation,
        on_delete=models.CASCADE,
        related_name="chat_summary"
    )

    summary = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Summary for {self.presentation.title}"