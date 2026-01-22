from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from datetime import datetime

User = get_user_model()

class Book(models.Model):
    BOOK_TYPE_CHOICES = [
        ("novel", "Novel"),
        ("short_stories", "Short Stories"),
        ("poetry", "Poetry"),
    ]

    GENRE_CHOICES = [
        ("fiction", "Fiction"),
        ("fantasy", "Fantasy"),
        ("sci_fi", "Science Fiction"),
        ("biography", "Biography"),
        ("self_help", "Self Help"),
    ]

    title = models.CharField(max_length=255, db_index=True)
    author = models.CharField(max_length=255, db_index=True)

    description = models.TextField(blank=True)

    book_type = models.CharField(
        max_length=50,
        choices=BOOK_TYPE_CHOICES,
        null=True,  
        blank=True,  
        db_index=True,
    )

    genre = models.CharField(
        max_length=50,
        choices=GENRE_CHOICES,
        null=True,  
        blank=True,  
        db_index=True,
    )

    cover_image = models.ImageField(
        upload_to="book_covers/",
        null=True,
        blank=True,
    )

    published_year = models.IntegerField(null=True, blank=True, db_index=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['title', 'author']),
            models.Index(fields=['genre', 'book_type']),
            models.Index(fields=['published_year']),
        ]

    def clean(self):
        """Validate model-level constraints"""
        if self.published_year is not None:
            current_year = datetime.now().year
            if self.published_year < 0 or self.published_year > current_year + 1:
                raise ValidationError({
                    'published_year': f'Published year must be between 0 and {current_year + 1}'
                })

    def save(self, *args, **kwargs):
        """Override save to call clean validation"""
        self.full_clean()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} – {self.author}"


class UserNote(models.Model):
    """Private notes that users can add to books"""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notes')
    book = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='user_notes')
    note = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.user.username}'s note for {self.book.title}"
