from django.db import models

class Book(models.Model):
    BOOK_TYPE_CHOICES = [
        ("novel", "Novel"),
        ("short_stories", "Short Stories"),
        ("poetry", "Poetry"),
        ("non_fiction", "Non-fiction"),
    ]

    GENRE_CHOICES = [
        ("fiction", "Fiction"),
        ("fantasy", "Fantasy"),
        ("sci_fi", "Science Fiction"),
        ("biography", "Biography"),
        ("self_help", "Self Help"),
    ]

    title = models.CharField(max_length=255)
    author = models.CharField(max_length=255)

    description = models.TextField(blank=True)

    book_type = models.CharField(
        max_length=50,
        choices=BOOK_TYPE_CHOICES,
        null=True,  
        blank=True,  
    )

    genre = models.CharField(
        max_length=50,
        choices=GENRE_CHOICES,
        null=True,  
        blank=True,  
    )

    cover_image = models.ImageField(
        upload_to="book_covers/",
        null=True,
        blank=True,
    )

    published_year = models.IntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} – {self.author}"
