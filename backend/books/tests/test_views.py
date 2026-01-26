import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from books.models import Book

User = get_user_model()

pytestmark = pytest.mark.django_db


@pytest.fixture
def api_client():
    """Create an API client for making requests"""
    return APIClient()


@pytest.fixture
def user():
    """Create a test user"""
    return User.objects.create_user(
        username='testuser',
        email='test@example.com',
        password='testpass123'
    )


@pytest.fixture
def authenticated_client(user):
    """Create an authenticated API client"""
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def book():
    """Create a test book"""
    return Book.objects.create(
        title='Test Book',
        author='Test Author',
        description='A test book description',
        genre='fiction',
        book_type='novel',
        published_year=2020
    )


@pytest.fixture
def multiple_books():
    """Create multiple test books"""
    books = [
        Book.objects.create(
            title='Book One',
            author='Author One',
            genre='fiction',
            book_type='novel',
            published_year=2020
        ),
        Book.objects.create(
            title='Book Two',
            author='Author Two',
            genre='fantasy',
            book_type='novel',
            published_year=2021
        ),
        Book.objects.create(
            title='Book Three',
            author='Author Three',
            genre='sci_fi',
            book_type='short_stories',
            published_year=2019
        ),
    ]
    return books


class TestBookListCreateAPIView:
    """Tests for listing and creating books"""

    def test_list_books_returns_success(self, api_client, book):
        """Unauthenticated users can list books"""
        response = api_client.get('/api/books/')
        assert response.status_code == status.HTTP_200_OK
        assert 'results' in response.data
        book_ids = [b['id'] for b in response.data['results']]
        assert book.id in book_ids

    def test_list_books_includes_pagination_metadata(self, api_client, multiple_books):
        """List endpoint returns pagination metadata"""
        response = api_client.get('/api/books/')
        assert response.status_code == status.HTTP_200_OK
        assert 'count' in response.data
        assert 'next' in response.data
        assert 'previous' in response.data
        assert 'current_page' in response.data
        assert 'total_pages' in response.data
        book_ids = [b['id'] for b in response.data['results']]
        for book in multiple_books:
            assert book.id in book_ids

    def test_list_books_with_filtering_by_genre(self, api_client, multiple_books):
        """Books can be filtered by genre"""
        response = api_client.get('/api/books/?genre=fantasy')
        assert response.status_code == status.HTTP_200_OK
        for book in response.data['results']:
            assert book['genre'] == 'fantasy'
        book_ids = [b['id'] for b in response.data['results']]
        fantasy_book = [b for b in multiple_books if b.genre == 'fantasy'][0]
        assert fantasy_book.id in book_ids

    def test_list_books_with_filtering_by_book_type(self, api_client, multiple_books):
        """Books can be filtered by book_type"""
        response = api_client.get('/api/books/?book_type=short_stories')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert response.data['results'][0]['book_type'] == 'short_stories'

    def test_list_books_with_search_by_title(self, api_client, multiple_books):
        """Books can be searched by title"""
        response = api_client.get('/api/books/?search=Book One')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert 'Book One' in response.data['results'][0]['title']

    def test_list_books_with_search_by_author(self, api_client, multiple_books):
        """Books can be searched by author"""
        response = api_client.get('/api/books/?search=Author Two')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data['results']) == 1
        assert 'Author Two' in response.data['results'][0]['author']

    def test_list_books_with_ordering_by_title(self, api_client, multiple_books):
        """Books can be ordered by title"""
        response = api_client.get('/api/books/?ordering=title')
        assert response.status_code == status.HTTP_200_OK
        results = response.data['results']
        test_book_titles = {b.title for b in multiple_books}
        result_titles = [r['title'] for r in results if r['title'] in test_book_titles]
        assert result_titles == sorted(result_titles)

    def test_list_books_with_ordering_by_published_year(self, api_client, multiple_books):
        """Books can be ordered by published_year"""
        response = api_client.get('/api/books/?ordering=published_year')
        assert response.status_code == status.HTTP_200_OK
        results = response.data['results']
        test_book_years = {b.published_year for b in multiple_books}
        result_years = [r['published_year'] for r in results if r['published_year'] in test_book_years]
        assert result_years == sorted(result_years)

    def test_list_books_with_reverse_ordering(self, api_client, multiple_books):
        """Books can be ordered in reverse"""
        response = api_client.get('/api/books/?ordering=-published_year')
        assert response.status_code == status.HTTP_200_OK
        results = response.data['results']
        assert results[0]['published_year'] == 2021
        assert results[2]['published_year'] == 2019

    def test_create_book_requires_authentication(self, api_client):
        """Unauthenticated users cannot create books"""
        book_data = {
            'title': 'New Book',
            'author': 'New Author',
            'genre': 'fiction',
            'book_type': 'novel',
            'published_year': 2023
        }
        response = api_client.post('/api/books/', book_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_book_with_authentication(self, authenticated_client):
        """Authenticated users can create books"""
        book_data = {
            'title': 'New Book',
            'author': 'New Author',
            'description': 'A new book',
            'genre': 'fiction',
            'book_type': 'novel',
            'published_year': 2023
        }
        response = authenticated_client.post('/api/books/', book_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['title'] == 'New Book'
        assert response.data['author'] == 'New Author'
        assert Book.objects.filter(title='New Book').exists()

    def test_create_book_validates_title_not_empty(self, authenticated_client):
        """Book creation validates that title is not empty"""
        book_data = {
            'title': '   ',
            'author': 'New Author',
            'genre': 'fiction',
        }
        response = authenticated_client.post('/api/books/', book_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_book_validates_author_not_empty(self, authenticated_client):
        """Book creation validates that author is not empty"""
        book_data = {
            'title': 'New Book',
            'author': '   ',
            'genre': 'fiction',
        }
        response = authenticated_client.post('/api/books/', book_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_create_book_validates_published_year_range(self, authenticated_client):
        """Book creation validates published_year is within reasonable range"""
        book_data = {
            'title': 'New Book',
            'author': 'New Author',
            'published_year': 3000
        }
        response = authenticated_client.post('/api/books/', book_data, format='json')
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestBookDetailAPIView:
    """Tests for retrieving, updating, and deleting individual books"""

    def test_retrieve_book_returns_success(self, api_client, book):
        """Unauthenticated users can retrieve book details"""
        response = api_client.get(f'/api/books/{book.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == book.id
        assert response.data['title'] == book.title
        assert response.data['author'] == book.author
        assert 'description' in response.data

    def test_retrieve_nonexistent_book_returns_404(self, api_client):
        """Retrieving a non-existent book returns 404"""
        response = api_client.get('/api/books/99999/')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_book_with_put(self, api_client, book):
        """Unauthenticated users can update books"""
        update_data = {
            'title': 'Updated Title',
            'author': 'Updated Author',
            'description': book.description,
            'genre': book.genre,
            'book_type': book.book_type,
            'published_year': book.published_year
        }
        response = api_client.put(f'/api/books/{book.id}/', update_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Updated Title'
        book.refresh_from_db()
        assert book.title == 'Updated Title'

    def test_update_book_with_patch(self, api_client, book):
        """Books can be partially updated with PATCH"""
        response = api_client.patch(f'/api/books/{book.id}/', {'title': 'Patched Title'}, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['title'] == 'Patched Title'
        book.refresh_from_db()
        assert book.title == 'Patched Title'

    def test_delete_book(self, api_client, book):
        """Unauthenticated users can delete books"""
        book_id = book.id
        response = api_client.delete(f'/api/books/{book_id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Book.objects.filter(id=book_id).exists()


class TestBookChoicesAPIView:
    """Tests for book choices endpoint"""

    def test_get_choices_returns_genres_and_book_types(self, api_client):
        """Choices endpoint returns both genres and book_types"""
        response = api_client.get('/api/books/choices/')
        assert response.status_code == status.HTTP_200_OK
        assert 'genres' in response.data
        assert 'book_types' in response.data
        assert isinstance(response.data['genres'], list)
        assert isinstance(response.data['book_types'], list)

    def test_choices_have_value_and_label_structure(self, api_client):
        """Each choice has value and label fields"""
        response = api_client.get('/api/books/choices/')
        assert response.status_code == status.HTTP_200_OK
        if len(response.data['genres']) > 0:
            genre = response.data['genres'][0]
            assert 'value' in genre
            assert 'label' in genre
        if len(response.data['book_types']) > 0:
            book_type = response.data['book_types'][0]
            assert 'value' in book_type
            assert 'label' in book_type

    def test_choices_endpoint_does_not_require_authentication(self, api_client):
        """Choices endpoint is accessible without authentication"""
        response = api_client.get('/api/books/choices/')
        assert response.status_code == status.HTTP_200_OK
