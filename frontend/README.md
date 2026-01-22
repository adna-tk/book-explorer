# Book Explorer - Frontend

React TypeScript application built with Vite, React Query, and Tailwind CSS.

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup (Optional)

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

If not set, defaults to `http://localhost:8000/api`

### 3. Start Development Server

```bash
npm run dev
```

Application will be available at `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # API client and endpoints
│   │   ├── client.ts     # Axios instance with interceptors
│   │   └── auth.ts      # Authentication API calls
│   ├── components/       # Reusable React components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Header.tsx
│   │   ├── Pagination.tsx
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   │   ├── useAuth.ts   # Authentication logic
│   │   ├── useBooks.ts  # Books data fetching
│   │   ├── useNotes.ts  # Notes CRUD operations
│   │   └── useCurrentUser.ts
│   ├── pages/           # Page components
│   │   ├── Home.tsx     # Book listing page
│   │   ├── BookDetails.tsx
│   │   └── Login.tsx
│   ├── App.tsx          # Main app component
│   ├── MainLayout.tsx   # Layout with header
│   └── AuthLayout.tsx   # Auth page layout
├── public/              # Static assets
├── package.json
└── vite.config.ts       # Vite configuration
```

## 🛠️ Available Scripts

### Development

```bash
npm run dev          # Start development server
```

### Production

```bash
npm run build        # Build for production
npm run preview      # Preview production build
```

### Code Quality

```bash
npm run lint         # Run ESLint
```

## 🔧 Configuration

### API Base URL

Set in `.env`:
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Or modify `src/api/client.ts`:
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';
```

### Port Configuration

Edit `vite.config.ts`:
```typescript
export default defineConfig({
  server: {
    port: 5173,  // Change to your preferred port
  },
})
```

## 📚 Key Features

### State Management

- **React Query** for server state
- **React hooks** for local state
- **localStorage** for token persistence

### Authentication Flow

1. User logs in via `/login`
2. JWT tokens stored in `localStorage`
3. Tokens automatically added to API requests
4. 401 errors trigger automatic logout

### Data Fetching

- Books list with pagination
- Search and filtering
- Optimistic updates for notes
- Skeleton loaders for better UX

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **CSS Variables** for theming
- **Dark mode** support
- **Responsive design**

## 📦 Dependencies

### Core

- `react@^19.2.0` - UI library
- `react-dom@^19.2.0` - React DOM renderer
- `react-router-dom@^7.12.0` - Routing
- `@tanstack/react-query@^5.90.19` - Data fetching
- `axios@^1.13.2` - HTTP client

### UI & Styling

- `tailwindcss@^4.1.18` - CSS framework
- `lucide-react@^0.562.0` - Icons
- `tailwind-merge@^3.4.0` - Tailwind class merging

### Development

- `vite@^7.2.4` - Build tool
- `typescript@~5.9.3` - Type checking
- `eslint@^9.39.1` - Linting

## 🔐 Authentication

### Test Users

- **Username:** `john.doe@mail.com` | **Password:** `JohnDoe123`
- **Username:** `jane.doe@mail.com` | **Password:** `JaneJane123`

### Token Management

Tokens are stored in `localStorage`:
- `access_token` - Short-lived (60 minutes)
- `refresh_token` - Long-lived (7 days)

**Note:** For production, consider using httpOnly cookies for better security.

## 🧩 Components

### Reusable Components

- `Button` - Styled button with variants
- `Card` - Book card display
- `Input` - Form input field
- `Dropdown` - Custom dropdown select
- `Pagination` - Page navigation
- `Loader` - Loading spinner
- `BookSkeleton` - Skeleton loader for books
- `Note` - Note display and editing

### Layout Components

- `MainLayout` - Main app layout with header
- `AuthLayout` - Authentication page layout
- `Header` - Navigation header with theme toggle

## 🎯 Custom Hooks

### `useAuth`

Authentication logic:
```typescript
const { login, logout, isAuthenticated, isLoading, error } = useAuth();
```

### `useBooks`

Books data fetching:
```typescript
const { data, isLoading, isError } = useBooks({
  search: 'query',
  genre: 'fiction',
  page: 1,
});
```

### `useNotes`

Notes CRUD operations:
```typescript
const { data: notes } = useNotes(bookId);
const createNote = useCreateNote();
const updateNote = useUpdateNote();
const deleteNote = useDeleteNote();
```

## 🐛 Troubleshooting

### Port Already in Use

Change port in `vite.config.ts` or kill the process:
```bash
lsof -ti:5173 | xargs kill -9
```

### API Connection Failed

1. Check backend is running on `http://localhost:8000`
2. Verify `VITE_API_BASE_URL` in `.env`
3. Check CORS configuration in backend

### Build Errors

```bash
rm -rf node_modules package-lock.json
npm install
```

### Type Errors

```bash
npm run build  # Check TypeScript errors
```

## 🚀 Production Build

### Build

```bash
npm run build
```

Output in `dist/` directory.

### Deploy

Serve `dist/` with any static file server:

```bash
# Using serve
npx serve dist

# Using Python
cd dist && python -m http.server 8000

# Using nginx
# Configure nginx to serve dist/ directory
```

### Environment Variables

For production, set environment variables on your hosting platform:
- `VITE_API_BASE_URL` - Your production API URL

## 📝 Development Tips

### Hot Module Replacement

Vite provides instant HMR. Changes reflect immediately in the browser.

### TypeScript

Type definitions in:
- `src/hooks/types.d.ts` - Global types
- Component props are typed
- API responses are typed

### React Query DevTools

Add to `App.tsx` for debugging:
```typescript
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// In component
<ReactQueryDevtools initialIsOpen={false} />
```

## 🔒 Security Considerations

- Tokens stored in `localStorage` (XSS vulnerable)
- Consider httpOnly cookies for production
- Input sanitization needed for user notes
- Implement CSRF protection for mutations

---

For more information, see the [main README](../README.md).
