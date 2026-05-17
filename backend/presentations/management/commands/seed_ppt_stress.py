import random
import string
from django.core.management.base import BaseCommand
from presentations.models import Presentation, Slide, SlideElement


class Command(BaseCommand):
    help = "Seed random elements for stress testing PPT export"

    def handle(self, *args, **kwargs):
        presentation_id = 1  # Change if needed

        try:
            presentation = Presentation.objects.get(id=presentation_id)
        except Presentation.DoesNotExist:
            self.stdout.write(self.style.ERROR("Presentation not found"))
            return

        slides = list(presentation.slides.all().order_by("order"))

        if not slides:
            self.stdout.write("Creating 4 slides...")
            for i in range(4):
                Slide.objects.create(
                    presentation=presentation,
                    order=i
                )
            slides = list(presentation.slides.all().order_by("order"))

        self.stdout.write("Generating 100 random elements...")

        for i in range(100):
            slide = random.choice(slides)

            element_type = random.choice(["text", "rectangle"])

            x = (i % 3) * 300
            y = (i // 3) * 150
            width = random.randint(100, 400)
            height = random.randint(50, 300)

            z_index = random.randint(0, 20)

            if element_type == "text":
                content = {
                    "text": self.random_text(random.randint(20, 200))
                }

                style = {
                    "fontSize": random.randint(10, 72),
                    "color": self.random_color()
                }
            else:
                content = {}
                style = {
                    "fillColor": self.random_color()
                }

            SlideElement.objects.create(
                slide=slide,
                type=element_type,
                x=x,
                y=y,
                width=width,
                height=height,
                rotation=0,
                z_index=z_index,
                content=content,
                style=style
            )

        self.stdout.write(self.style.SUCCESS("Stress test data created successfully."))

    def random_text(self, length):
        letters = string.ascii_letters + "     "
        return ''.join(random.choice(letters) for _ in range(length))

    def random_color(self):
        return "#{:06x}".format(random.randint(0, 0xFFFFFF))