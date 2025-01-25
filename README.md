# Team Management Frontend

![Next.js](https://img.shields.io/badge/Next.js-13.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)

Team management system with authentication, access control, and user management.

## 🚀 Features

- 🔐 **Authentication**
  - Email and password login
  - New user registration
  - Remember me option
  - Route protection

- 👤 **User Profile**
  - View and edit personal data
  - Password change with security validations
  - Account deletion

- 👥 **User Management (Admin)**
  - Complete user listing
  - User deletion
  - User details viewing

## 🛠️ Technologies

- [Next.js 13](https://nextjs.org/) - React Framework with SSR
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript superset
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hot Toast](https://react-hot-toast.com/) - Elegant notifications

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Team Management API running locally

## 🚀 Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/team-management-frontend.git
cd team-management-frontend
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Configure environment variables
```bash
cp .env.example .env.local
```
Edit the `.env.local` file with your settings:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

4. Start development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔒 Password Rules

Passwords must meet the following criteria:
- Minimum 8 characters
- Maximum 30 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%?&)

## 👥 Access Levels

- **User**: Access to own profile
- **Admin**: Access to user management and all features

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## ✨ Author

Made with ❤️ by [Your Name](https://github.com/your-username)
