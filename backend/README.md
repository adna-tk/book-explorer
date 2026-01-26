# Book Explorer - Backend

Django REST Framework API for the Book Explorer application.

## Quick Start

### 1. Create Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Environment Setup

Create a `.env` file in the `backend/` directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

**Important:** Generate a secure secret key for production:
```python
python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

### 4. Database Setup

```bash
python manage.py migrate
```

This will:
- Create database tables
- Run initial data migration (creates 16 sample books)
- Create test users (john.doe@mail.com, jane.doe@mail.com)

### 5. Run Development Server

```bash
python manage.py runserver
```

API will be available at `http://localhost:8000`

## Project Structure

```
backend/
├── accounts/          # User authentication app
│   ├── views.py      # Login, user profile
│   ├── serializers.py
│   └── urls.py
├── books/            # Books and notes app
│   ├── models.py     # Book, UserNote models
│   ├── views.py      # API views
│   ├── serializers.py
│   ├── pagination.py # Custom pagination
│   └── urls.py
├── book_explorer/    # Project settings
│   ├── settings.py   # Django configuration
│   └── urls.py       # Root URL configuration
├── manage.py
├── requirements.txt
└── .env              # Environment variables (not in git)
```

## Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Django secret key | **Required** |
| `DEBUG` | Debug mode | `False` |
| `ALLOWED_HOSTS` | Allowed hostnames | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | CORS allowed origins | `http://localhost:5173,...` |

### Database

Default: SQLite (`db.sqlite3`)

To use PostgreSQL:
```python
# settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST', 'localhost'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}
```

## API Endpoints

### Authentication

- `POST /api/auth/token/` - Login (get JWT tokens)
- `POST /api/auth/token/refresh/` - Refresh access token
- `GET /api/auth/me/` - Get current user info

### Books

- `GET /api/books/` - List books (paginated, searchable, filterable)
  - Query params: `page`, `page_size`, `search`, `genre`, `book_type`, `ordering`
- `GET /api/books/{id}/` - Get book details
- `POST /api/books/` - Create book (authenticated)
- `GET /api/books/choices/` - Get genre and book type choices

### Notes

- `GET /api/books/{book_id}/notes/` - List user's notes for a book
- `POST /api/books/{book_id}/notes/` - Create note
- `GET /api/books/notes/{id}/` - Get note details
- `PUT /api/books/notes/{id}/` - Update note
- `DELETE /api/books/notes/{id}/` - Delete note

## Management Commands

### Create Test Users

```bash
python manage.py create_test_users
```

Creates:
- `john.doe@mail.com` / `JohnDoe123`
- `jane.doe@mail.com` / `JaneJane123`

### Django Admin

```bash
python manage.py createsuperuser
python manage.py runserver
```

Access admin at `http://localhost:8000/admin/`

## Testing

The project uses **pytest** and **pytest-django** for API testing.

### Running Tests

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

### Test Coverage

The project has **50 tests** covering:

- **Books API** (20 tests)
  - List, create, update, delete books
  - Filtering, search, sorting
  - Data validation
  - Pagination

- **User Notes API** (16 tests)
  - List and create notes
  - User isolation
  - CRUD operations
  - Authentication and permissions

- **Authentication API** (10 tests)
  - JWT token obtain and refresh
  - Current user endpoint
  - Credential validation

- **Choices API** (3 tests)
  - Get genres and book_types

- **Home view** (1 test)

### Test Structure

```
backend/
├── books/
│   └── tests/
│       ├── test_views.py      # Books API tests
│       └── test_notes.py      # Notes API tests
├── accounts/
│   └── tests/
│       └── test_views.py      # Auth API tests
└── pytest.ini                 # Pytest configuration
```

### Test Dependencies

- `pytest==8.3.3`
- `pytest-django==4.8.0`

For more details, see [TESTING.md](./TESTING.md).

## Dependencies

- `Django==4.2.27` - Web framework
- `djangorestframework==3.16.1` - REST API framework
- `djangorestframework-simplejwt==5.3.1` - JWT authentication
- `django-cors-headers==4.9.0` - CORS handling
- `django-filter==25.1` - Filtering support
- `pillow==11.3.0` - Image processing
- `python-dotenv==1.0.0` - Environment variables

## Security Features

- JWT authentication with token rotation
- Environment-based secret key
- Input validation on models and serializers
- Permission-based access control
- CORS configuration
- SQL injection protection (Django ORM)
- XSS protection

## Troubleshooting

### Migration Errors

```bash
python manage.py migrate --run-syncdb
```

### Secret Key Error

Make sure `.env` file exists with `SECRET_KEY` variable.

### Port Already in Use

```bash
python manage.py runserver 8001
```

### Database Locked (SQLite)

Close any database connections or restart the server.

## Development Tips

### Django Shell

```bash
python manage.py shell
```

Example:
```python
from books.models import Book
Book.objects.count()
```

### Check Configuration

```bash
python manage.py check
```

### Create Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

## Production Deployment

1. Set `DEBUG=False` in `.env`
2. Set secure `SECRET_KEY`
3. Configure `ALLOWED_HOSTS`
4. Use PostgreSQL or MySQL
5. Set up static file serving
6. Use WSGI server (gunicorn, uWSGI)
7. Set up reverse proxy (nginx)
8. Enable HTTPS
9. Set up monitoring and logging

---

For more information, see the [main README](../README.md).
