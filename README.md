# Book Explorer

A full-stack web application for browsing and managing books with user authentication, search, filtering, and personal notes.

## 🚀 Tech Stack

- **Backend:** Django 4.2 + Django REST Framework
- **Frontend:** React 19 + TypeScript + Vite
- **Authentication:** JWT (djangorestframework-simplejwt)
- **State Management:** React Query (TanStack Query)
- **Styling:** Tailwind CSS
- **Database:** SQLite (development)

## 📋 Prerequisites

- Python 3.9+
- Node.js 18+
- npm or yarn

## 🏗️ Project Structure

```
book-explorer/
├── backend/          # Django REST API
├── frontend/         # React TypeScript app
└── README.md         # This file
```

## 🚦 Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd book-explorer
```

### 2. Set up Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate 
pip install -r requirements.txt
cp .env.example .env  
python manage.py migrate
python manage.py createsuperuser 
python manage.py runserver
```

Backend will run on `http://localhost:8000`

### 3. Set up Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend will run on `http://localhost:5173`

## 🔐 Default Test Users

The application includes test users created via migration:

- **Username:** `john.doe@mail.com` | **Password:** `JohnDoe123`
- **Username:** `jane.doe@mail.com` | **Password:** `JaneJane123`

## 📚 Features

- ✅ User authentication (JWT)
- ✅ Book browsing with pagination
- ✅ Search and filter books
- ✅ Sort books by various criteria
- ✅ Personal notes for each book
- ✅ Responsive design
- ✅ Dark mode support

## 🔧 Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory (optional):

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

## 📖 API Endpoints

- `GET /api/books/` - List books (paginated)
- `GET /api/books/{id}/` - Book details
- `POST /api/books/` - Create book (authenticated)
- `GET /api/books/choices/` - Get genre and book type choices
- `POST /api/auth/token/` - Login
- `POST /api/auth/register/` - Register
- `GET /api/auth/me/` - Current user info
- `GET /api/books/{id}/notes/` - Get user notes for a book
- `POST /api/books/{id}/notes/` - Create note
- `PUT /api/books/notes/{id}/` - Update note
- `DELETE /api/books/notes/{id}/` - Delete note

## 🧪 Development

### Backend

```bash
cd backend
source venv/bin/activate
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm run dev
```

## 📦 Production Build

### Backend

```bash
cd backend
pip install -r requirements.txt
python manage.py collectstatic
python manage.py migrate
# Use gunicorn or similar WSGI server
```

### Frontend

```bash
cd frontend
npm run build
# Serve the dist/ directory with a web server
```

## 📝 Additional Commands

### Create test users (Backend)

```bash
python manage.py create_test_users
```

### Django shell (Backend)

```bash
python manage.py shell
```

## 🐛 Troubleshooting

### Backend issues

- **Module not found:** Make sure virtual environment is activated
- **Migration errors:** Run `python manage.py migrate`
- **Secret key error:** Create `.env` file with `SECRET_KEY`

### Frontend issues

- **Port already in use:** Change port in `vite.config.ts`
- **API connection failed:** Check `VITE_API_BASE_URL` in `.env`
- **Build errors:** Clear `node_modules` and reinstall

## 📄 License

This project is a take-home assignment.

## 👥 Contributing

This is a demonstration project. For production use, consider:

- Adding comprehensive tests
- Implementing rate limiting
- Adding API documentation (Swagger/OpenAPI)
- Setting up CI/CD pipeline
- Adding error tracking (Sentry)

---

For detailed setup instructions, see:
- [Backend README](./backend/README.md)
- [Frontend README](./frontend/README.md)
