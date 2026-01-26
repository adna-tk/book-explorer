import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from books.models import Book, UserNote

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
def other_user():
    """Create another test user"""
    return User.objects.create_user(
        username='otheruser',
        email='other@example.com',
        password='testpass123'
    )


@pytest.fixture
def authenticated_client(user):
    """Create an authenticated API client"""
    client = APIClient()
    client.force_authenticate(user=user)
    return client


@pytest.fixture
def other_authenticated_client(other_user):
    """Create an authenticated API client for another user"""
    client = APIClient()
    client.force_authenticate(user=other_user)
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
def user_note(user, book):
    """Create a test user note"""
    return UserNote.objects.create(
        user=user,
        book=book,
        note='This is a test note'
    )


class TestBookNotesListAPIView:
    """Tests for listing and creating notes for a book"""

    def test_list_notes_requires_authentication(self, api_client, book):
        """Listing notes requires authentication"""
        response = api_client.get(f'/api/books/{book.id}/notes/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_list_notes_returns_user_notes_for_book(self, authenticated_client, user, book):
        """Authenticated users can list their notes for a book"""
        UserNote.objects.create(user=user, book=book, note='First note')
        UserNote.objects.create(user=user, book=book, note='Second note')
        
        response = authenticated_client.get(f'/api/books/{book.id}/notes/')
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) == 2
        assert response.data[0]['note'] in ['First note', 'Second note']

    def test_list_notes_only_returns_current_user_notes(self, authenticated_client, other_authenticated_client, user, other_user):
        """Users only see their own notes, not other users' notes"""
        test_book = Book.objects.create(
            title='Isolation Test Book',
            author='Test Author',
            genre='fiction',
            book_type='novel',
            published_year=2020
        )
        
        my_note = UserNote.objects.create(user=user, book=test_book, note='My note')
        other_note = UserNote.objects.create(user=other_user, book=test_book, note='Other note')
        
        response = authenticated_client.get(f'/api/books/{test_book.id}/notes/')
        assert response.status_code == status.HTTP_200_OK
        note_texts = [note['note'] for note in response.data]
        assert 'My note' in note_texts
        
        assert 'Other note' not in note_texts
        
        returned_note_ids = [note['id'] for note in response.data]
        for note_id in returned_note_ids:
            note = UserNote.objects.get(id=note_id)
            assert note.user == user, f"Note {note_id} belongs to {note.user}, not {user}"

    def test_list_notes_returns_404_for_nonexistent_book(self, authenticated_client):
        """Listing notes for non-existent book returns 404"""
        response = authenticated_client.get('/api/books/99999/notes/')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_create_note_requires_authentication(self, api_client, book):
        """Creating a note requires authentication"""
        note_data = {'note': 'A new note'}
        response = api_client.post(f'/api/books/{book.id}/notes/', note_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_note_succeeds_with_authentication(self, authenticated_client, user, book):
        """Authenticated users can create notes for a book"""
        note_data = {'note': 'A new note'}
        response = authenticated_client.post(f'/api/books/{book.id}/notes/', note_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data['note'] == 'A new note'
        assert response.data['book'] == book.id
        assert UserNote.objects.filter(user=user, book=book, note='A new note').exists()

    def test_create_note_automatically_sets_user_and_book(self, authenticated_client, user, book):
        """Note creation automatically sets user and book from context"""
        note_data = {'note': 'Auto-assigned note'}
        response = authenticated_client.post(f'/api/books/{book.id}/notes/', note_data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        note = UserNote.objects.get(id=response.data['id'])
        assert note.user == user
        assert note.book == book

    def test_create_note_returns_404_for_nonexistent_book(self, authenticated_client):
        """Creating note for non-existent book returns 404"""
        nonexistent_id = 999999999
        note_data = {'note': 'A note'}
        response = authenticated_client.post(f'/api/books/{nonexistent_id}/notes/', note_data, format='json')
        assert response.status_code == status.HTTP_404_NOT_FOUND


class TestBookNoteDetailAPIView:
    """Tests for retrieving, updating, and deleting individual notes"""

    def test_retrieve_note_requires_authentication(self, api_client, user_note):
        """Retrieving a note requires authentication"""
        response = api_client.get(f'/api/books/notes/{user_note.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_retrieve_note_returns_success(self, authenticated_client, user_note):
        """Authenticated users can retrieve their own notes"""
        response = authenticated_client.get(f'/api/books/notes/{user_note.id}/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user_note.id
        assert response.data['note'] == user_note.note
        assert 'created_at' in response.data
        assert 'updated_at' in response.data

    def test_retrieve_other_user_note_returns_404(self, other_authenticated_client, user_note):
        """Users cannot retrieve other users' notes"""
        response = other_authenticated_client.get(f'/api/books/notes/{user_note.id}/')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_retrieve_nonexistent_note_returns_404(self, authenticated_client):
        """Retrieving a non-existent note returns 404"""
        response = authenticated_client.get('/api/books/notes/99999/')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_update_note_requires_authentication(self, api_client, user_note):
        """Updating a note requires authentication"""
        update_data = {'note': 'Updated note'}
        response = api_client.patch(f'/api/books/notes/{user_note.id}/', update_data, format='json')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_update_note_with_patch(self, authenticated_client, user_note):
        """Authenticated users can update their own notes"""
        update_data = {'note': 'Updated note content'}
        response = authenticated_client.patch(f'/api/books/notes/{user_note.id}/', update_data, format='json')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['note'] == 'Updated note content'
        user_note.refresh_from_db()
        assert user_note.note == 'Updated note content'

    def test_update_other_user_note_returns_404(self, other_authenticated_client, user_note):
        """Users cannot update other users' notes"""
        update_data = {'note': 'Hacked note'}
        response = other_authenticated_client.patch(f'/api/books/notes/{user_note.id}/', update_data, format='json')
        assert response.status_code == status.HTTP_404_NOT_FOUND

    def test_delete_note_requires_authentication(self, api_client, user_note):
        """Deleting a note requires authentication"""
        response = api_client.delete(f'/api/books/notes/{user_note.id}/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_delete_note_succeeds(self, authenticated_client, user_note):
        """Authenticated users can delete their own notes"""
        note_id = user_note.id
        response = authenticated_client.delete(f'/api/books/notes/{note_id}/')
        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not UserNote.objects.filter(id=note_id).exists()

    def test_delete_other_user_note_returns_404(self, other_authenticated_client, user_note):
        """Users cannot delete other users' notes"""
        response = other_authenticated_client.delete(f'/api/books/notes/{user_note.id}/')
        assert response.status_code == status.HTTP_404_NOT_FOUND
