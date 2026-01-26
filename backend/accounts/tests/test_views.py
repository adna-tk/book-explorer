import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

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


class TestMeView:
    """Tests for current user details endpoint"""

    def test_get_current_user_requires_authentication(self, api_client):
        """Getting current user requires authentication"""
        response = api_client.get('/api/auth/me/')
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_get_current_user_returns_user_details(self, authenticated_client, user):
        """Authenticated users can retrieve their own details"""
        response = authenticated_client.get('/api/auth/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['id'] == user.id
        assert response.data['username'] == user.username
        assert response.data['email'] == user.email

    def test_get_current_user_includes_optional_fields(self, authenticated_client, user):
        """User details include optional fields like first_name and last_name"""
        user.first_name = 'John'
        user.last_name = 'Doe'
        user.save()
        
        response = authenticated_client.get('/api/auth/me/')
        assert response.status_code == status.HTTP_200_OK
        assert response.data['first_name'] == 'John'
        assert response.data['last_name'] == 'Doe'


class TestTokenObtainPairView:
    """Tests for JWT token obtain endpoint"""

    def test_obtain_token_with_valid_credentials(self, api_client, user):
        """Users can obtain tokens with valid credentials"""
        response = api_client.post(
            '/api/auth/token/',
            {'username': 'testuser', 'password': 'testpass123'},
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_obtain_token_with_invalid_username(self, api_client, user):
        """Token obtain fails with invalid username"""
        response = api_client.post(
            '/api/auth/token/',
            {'username': 'wronguser', 'password': 'testpass123'},
            format='json'
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_obtain_token_with_invalid_password(self, api_client, user):
        """Token obtain fails with invalid password"""
        response = api_client.post(
            '/api/auth/token/',
            {'username': 'testuser', 'password': 'wrongpass'},
            format='json'
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_obtain_token_requires_username_and_password(self, api_client, user):
        """Token obtain requires both username and password"""
        response = api_client.post(
            '/api/auth/token/',
            {'username': 'testuser'},
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST


class TestTokenRefreshView:
    """Tests for JWT token refresh endpoint"""

    def test_refresh_token_with_valid_refresh_token(self, api_client, user):
        """Users can refresh tokens with valid refresh token"""
        # First obtain tokens
        token_response = api_client.post(
            '/api/auth/token/',
            {'username': 'testuser', 'password': 'testpass123'},
            format='json'
        )
        refresh_token = token_response.data['refresh']
        
        # Then refresh
        response = api_client.post(
            '/api/auth/token/refresh/',
            {'refresh': refresh_token},
            format='json'
        )
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data

    def test_refresh_token_with_invalid_refresh_token(self, api_client):
        """Token refresh fails with invalid refresh token"""
        response = api_client.post(
            '/api/auth/token/refresh/',
            {'refresh': 'invalid_token'},
            format='json'
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_refresh_token_requires_refresh_field(self, api_client):
        """Token refresh requires refresh field"""
        response = api_client.post(
            '/api/auth/token/refresh/',
            {},
            format='json'
        )
        assert response.status_code == status.HTTP_400_BAD_REQUEST
