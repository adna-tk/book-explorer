from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from .models import Book, UserNote
from .serializers import BookSerializer, UserNoteSerializer
from .pagination import BookPageNumberPagination
from .helpers import format_choices
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter


def home(request):
    html_content = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Book Explorer API</title>
        <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            h1 { color: #333; }
            a { display: inline-block; margin: 10px; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; }
            a:hover { background: #0056b3; }
        </style>
    </head>
    <body>
        <h1>Welcome to Book Explorer</h1>
        <p>Django REST Framework API is running.</p>
        <a href="/admin/">Admin Panel</a>
    </body>
    </html>
    """
    return HttpResponse(html_content)


class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = BookPageNumberPagination
    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]
    search_fields = ["title", "author"]
    filterset_fields = ["genre", "book_type"]
    ordering_fields = ["title", "author", "published_year", "created_at"]
    ordering = ["title"]

    def get_permissions(self):
        """
        Allow anyone to list books, but require authentication to create.
        """
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    def get_queryset(self):
        """
        Optimize query for list view by excluding description field.
        Description is only needed in detail view.
        """
        if self.request.method == 'GET' and 'pk' not in self.kwargs:
            return Book.objects.all().defer('description')
        return Book.objects.all()


class BookDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]


class BookChoicesAPIView(APIView):
    """
    Returns both genre and book_type choices in one call, e.g.:
    {
        "genres": [{ "value": "...", "label": "..." }],
        "book_types": [{ "value": "...", "label": "..." }]
    }
    Frontend can call this once on app start and populate dropdowns.
    """
    permission_classes = [AllowAny]

    def get(self, request):
        return Response(
            {
                "genres": format_choices(Book.GENRE_CHOICES),
                "book_types": format_choices(Book.BOOK_TYPE_CHOICES),
            }
        )


class BookNotesListAPIView(generics.ListCreateAPIView):
    """
    List all user's notes for a book, or create a new note.
    GET: Returns list of all user's notes for the book
    POST: Create a new note for the book
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserNoteSerializer

    def get_queryset(self):
        book_id = self.kwargs['book_id']
        if not Book.objects.filter(id=book_id).exists():
            raise NotFound("Book not found")
        return UserNote.objects.filter(book_id=book_id, user=self.request.user)

    def perform_create(self, serializer):
        book_id = self.kwargs['book_id']
        if not Book.objects.filter(id=book_id).exists():
            raise NotFound("Book not found")
        serializer.save(user=self.request.user, book_id=book_id)


class BookNoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific note.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserNoteSerializer

    def get_queryset(self):
        return UserNote.objects.filter(user=self.request.user)
