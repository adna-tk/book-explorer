from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookListCreateAPIView.as_view(), name='book-list'),
    path('<int:pk>/', views.BookDetailAPIView.as_view(), name='book-detail'),
    path('<int:book_id>/notes/', views.BookNotesListAPIView.as_view(), name='book-notes-list'),
    path('notes/<int:pk>/', views.BookNoteDetailAPIView.as_view(), name='book-note-detail'),
    path('choices/', views.BookChoicesAPIView.as_view(), name='book-choices'),
]

