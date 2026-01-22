from django.http import HttpResponse
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import NotFound
from .models import Book, UserNote
from .serializers import BookSerializer, UserNoteSerializer
from .pagination import BookPageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter

def home(request):
    return HttpResponse("<h1>Welcome to Book Explorer</h1>")

class BookListCreateAPIView(generics.ListCreateAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    pagination_class = BookPageNumberPagination

    def get_permissions(self):
        """
        Allow anyone to list books, but require authentication to create.
        """
        if self.request.method == 'POST':
            return [IsAuthenticated()]
        return [AllowAny()]

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter,
    ]

    search_fields = ["title", "author"]

    filterset_fields = ["genre", "book_type"]

    ordering_fields = ["title", "author", "published_year", "created_at"]
    ordering = ["title"]


class BookDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Book.objects.all()
    serializer_class = BookSerializer
    permission_classes = [AllowAny]


def _format_choices(choices):
    """
    Small helper to keep the value/label structure consistent everywhere.
    """
    return [{"value": value, "label": label} for value, label in choices]


class GenreChoicesAPIView(APIView):
    """
    Returns the server-side source-of-truth for Book.genre choices.
    Shape: [{ "value": "...", "label": "..." }, ...]
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(_format_choices(Book.GENRE_CHOICES))


class BookTypeChoicesAPIView(APIView):
    """
    Returns the server-side source-of-truth for Book.book_type choices.
    Shape: [{ "value": "...", "label": "..." }, ...]
    """

    permission_classes = [AllowAny]

    def get(self, request):
        return Response(_format_choices(Book.BOOK_TYPE_CHOICES))


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
                "genres": _format_choices(Book.GENRE_CHOICES),
                "book_types": _format_choices(Book.BOOK_TYPE_CHOICES),
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
        serializer.save(user=self.request.user, book_id=book_id)


class BookNoteDetailAPIView(generics.RetrieveUpdateDestroyAPIView):
    """
    Retrieve, update, or delete a specific note.
    """
    permission_classes = [IsAuthenticated]
    serializer_class = UserNoteSerializer

    def get_queryset(self):
        return UserNote.objects.filter(user=self.request.user)
