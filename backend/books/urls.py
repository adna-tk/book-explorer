from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('api/books/', views.BookListCreateAPIView.as_view(), name='book-list'),
    path('api/books/<int:pk>/', views.BookDetailAPIView.as_view(), name='book-detail'),
]
