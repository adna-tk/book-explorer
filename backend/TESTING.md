# Testing - Book Explorer API

## Overview

The project uses **pytest** and **pytest-django** for testing the Django REST Framework API. All tests are written in pytest style (not unittest).

## Installation

```bash
pip install -r requirements.txt
```

Dependencies:
- `pytest==8.3.3`
- `pytest-django==4.8.0`

## Running Tests

Run all tests
```bash
./venv/bin/pytest
```

Run with verbose output
```bash
./venv/bin/pytest -v 
```

Run specific test file
```bash
./venv/bin/pytest books/tests/test_views.py
```

Run specific test
```bash
./venv/bin/pytest books/tests/test_views.py::TestBookListCreateAPIView::test_list_books_returns_success
```


## Test Structure

```
backend/
├── books/
│   └── tests/
│       ├── test_views.py      # Books API tests
│       └── test_notes.py      # User Notes API tests
├── accounts/
│   └── tests/
│       └── test_views.py      # Authentication API tests
└── pytest.ini                 # Pytest configuration
```

## Tests by Module

### 1. Books API (`books/tests/test_views.py`)

**TestBookListCreateAPIView** - List and create books:
- List books (pagination, filtering, search, sorting)
- Create book (authentication, validation)
- Field validation (title, author, published_year)

**TestBookDetailAPIView** - Individual books:
- Retrieve details
- Update (PUT, PATCH)
- Delete
- 404 for non-existent books

**TestBookChoicesAPIView** - Filter choices:
- Get genres and book_types
- Response structure (value/label)

### 2. User Notes API (`books/tests/test_notes.py`)

**TestBookNotesListAPIView** - Notes for a book:
- List notes (only for authenticated user)
- Create note
- User isolation (user sees only their own notes)
- 404 for non-existent books

**TestBookNoteDetailAPIView** - Individual notes:
- Retrieve, update, delete
- User isolation
- 404 for other users' notes

### 3. Authentication API (`accounts/tests/test_views.py`)

**TestMeView** - Current user:
- Get authenticated user details
- Authentication requirement

**TestTokenObtainPairView** - JWT token:
- Get token with valid credentials
- Errors for invalid credentials

**TestTokenRefreshView** - Refresh token:
- Refresh access token
- Validate refresh token

## Concepts and Patterns

### Fixtures

Tests use pytest fixtures for shared resources:

```python
@pytest.fixture
def user():
    """Create a test user"""
    return User.objects.create_user(...)

@pytest.fixture
def authenticated_client(user):
    """Create an authenticated API client"""
    client = APIClient()
    client.force_authenticate(user=user)
    return client
```

**Important**: Each `authenticated_client` creates a new `APIClient()` instance to avoid authentication conflicts between tests.

### Database Access

All tests have `pytestmark = pytest.mark.django_db` at module level, which enables database access.

### Test Isolation

- Each test uses its own data (created in fixtures)
- Tests work with existing data from migrations (don't delete them)
- Assertions are robust - check for presence of test data instead of exact counts

## Statistics

- **Total tests**: 50
- **Books API**: 20 tests
- **Notes API**: 16 tests  
- **Auth API**: 10 tests
- **Choices API**: 3 tests
- **Home view**: 1 test

## Common Test Scenarios

### Happy Path
```python
def test_list_books_returns_success(self, api_client, book):
    response = api_client.get('/api/books/')
    assert response.status_code == status.HTTP_200_OK
```

### Authentication
```python
def test_create_book_requires_authentication(self, api_client):
    response = api_client.post('/api/books/', data)
    assert response.status_code == status.HTTP_401_UNAUTHORIZED
```

### Validation
```python
def test_create_book_validates_title_not_empty(self, authenticated_client):
    response = authenticated_client.post('/api/books/', {'title': '   '})
    assert response.status_code == status.HTTP_400_BAD_REQUEST
```

### Data Isolation
```python
def test_list_notes_only_returns_current_user_notes(self, authenticated_client, user, other_user):
```

## Best Practices

1. **Clear test names** - read like documentation
2. **One test = one functionality** - focus on one thing
3. **Fixtures for shared resources** - avoid code duplication
4. **Robust assertions** - tests work with existing data
5. **No mocking Django ORM** - use real database

## Troubleshooting

**Problem**: Tests fail with "Database access not allowed"
**Solution**: Check if you have `pytestmark = pytest.mark.django_db` in the test file

**Problem**: Tests return other users' data
**Solution**: Check if `authenticated_client` fixture creates a new `APIClient()` instance

**Problem**: Tests fail due to existing data
**Solution**: Tests are written to work with existing data - check for presence of test data instead of exact counts
