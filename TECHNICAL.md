# Technical Documentation - Team Management Frontend

## 📁 Project Structure

```
team-management-frontend/
├── src/
│   ├── app/                    # Application pages (Next.js App Router)
│   │   ├── login/             # Authentication
│   │   ├── register/          # User registration
│   │   ├── profile/           # User profile
│   │   ├── users/             # User management (Admin)
│   │   └── page.tsx           # Home page
│   ├── components/            # Reusable components
│   │   ├── Header.tsx         # Navigation header
│   │   └── Sidebar.tsx        # Side menu
│   ├── hooks/                 # Custom hooks
│   │   └── useAuth.ts         # Authentication hook
│   └── utils/                 # Utilities
│       └── auth.ts            # Authentication functions
├── public/                    # Static files
└── tailwind.config.js        # Tailwind CSS configuration
```

## 🔄 Authentication Flow

### Login
1. User submits credentials (email/password)
2. POST request to `/api/users/login`
3. JWT token stored in:
   - `localStorage` (if "Remember me" active)
   - `sessionStorage` (single session)

### Route Protection
- `useAuth` hook checks token on all pages
- Redirect to `/login` if not authenticated
- Role verification for administrative routes

## 🔌 API Integration

### Used Endpoints

#### Authentication
```typescript
POST /api/users/login
{
  email: string;
  password: string;
}

POST /api/users/register
{
  name: string;
  email: string;
  password: string;
}
```

#### Users
```typescript
GET /api/users/profile              // User profile
PUT /api/users/profile              // Update profile
PUT /api/users/change-password      // Change password
GET /api/users                      // List users (Admin)
DELETE /api/users/{id}              // Delete user (Admin)
```

### Response Interfaces

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: number;
    type: string;
    message: string;
    details?: Array<{
      field: string;
      message: string;
    }>;
  };
}

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}
```

## 🔒 Security

### Password Validations
```typescript
const validatePassword = (password: string): string[] => {
  const errors: string[] = [];
  
  if (!password) {
    errors.push('Password cannot be empty');
    return errors;
  }

  if (password.length < 8) errors.push('Minimum 8 characters');
  if (password.length > 30) errors.push('Maximum 30 characters');
  if (!/[A-Z]/.test(password)) errors.push('One uppercase letter');
  if (!/[a-z]/.test(password)) errors.push('One lowercase letter');
  if (!/[0-9]/.test(password)) errors.push('One number');
  if (!/[@$!%?&]/.test(password)) errors.push('One special character');

  return errors;
};
```

### Administrative Route Protection
```typescript
// Verification in components requiring admin access
const { user } = useAuth();
if (user?.role !== 'ADMIN') {
  router.push('/');
  return null;
}
```

## 🎨 Components and Styles

### Design System
- Primary colors: blue (`blue-600`)
- State colors:
  - Success: green (`green-600`)
  - Error: red (`red-600`)

### Layout
- Fixed header with navigation
- Responsive sidebar
- Adaptable main content

## 🔄 State Management

### Authentication
- JWT token stored in storage
- Global authentication context via `useAuth`
- User data in memory during session

### Forms
- Local state with `useState`
- Real-time validation
- Visual feedback via toast

## 📱 Responsiveness

### Responsive Layout
- Flexible layout with Flexbox and Grid
- Collapsible sidebar on small screens
- Tables with horizontal scroll on mobile devices

## 🚀 Performance

### Optimizations
- Lazy loading of heavy components
- Function memoization with `useCallback`
- User data caching
- Debounce on search inputs

### Code Splitting
```typescript
// Example of dynamic import
const UserList = dynamic(() => import('@/components/UserList'), {
  loading: () => <LoadingSpinner />
});
```

## 🧪 Tests

### Test Structure
```
__tests__/
├── components/
│   ├── Header.test.tsx
│   └── Sidebar.test.tsx
├── hooks/
│   └── useAuth.test.ts
└── pages/
    ├── login.test.tsx
    └── profile.test.tsx
```

### Test Examples
```typescript
describe('Login Page', () => {
  it('should show error for invalid credentials', async () => {
    render(<LoginPage />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong' },
    });
    
    fireEvent.click(screen.getByText(/login/i));
    
    expect(await screen.findByText(/invalid credentials/i)).toBeInTheDocument();
  });
});
```

## 📦 Deploy

### Requirements
- Node.js 18.x
- Environment variables configured
- API accessible

### Build Process
```bash
# Install dependencies
npm ci

# Build application
npm run build

# Start in production
npm start
```

## 🔍 Monitoring

### Logs
- API errors logged to console
- Visual feedback for user via toasts
- User action tracking

### Metrics
- Page load time
- Request error rate
- Memory usage

## 📚 Additional Resources

- [API Documentation](API.md)
- [Style Guide](STYLE_GUIDE.md)
- [Change Log](CHANGELOG.md) 