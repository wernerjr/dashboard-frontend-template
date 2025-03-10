# Dashboard Frontend Template

![Next.js](https://img.shields.io/badge/Next.js-13.0-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC)

A modern, production-ready dashboard template built with Next.js, TypeScript, and Tailwind CSS. Use this template to quickly bootstrap your admin panels, dashboards, and internal tools.

## 🎯 Template Overview

This template provides a solid foundation for building web applications with:

- 🔐 **Built-in Authentication**
  - Email and password login
  - New user registration
  - Remember me functionality
  - Protected routes

- 👤 **User Features**
  - Profile management
  - Security settings
  - Account preferences

- 🛡️ **Access Control**
  - Role-based permissions
  - Admin dashboard
  - User management interface

## 🛠️ Technologies

- [Next.js 13](https://nextjs.org/) - React Framework with SSR
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript superset
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [React Hot Toast](https://react-hot-toast.com/) - Elegant notifications

## 📋 Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Backend API (see API setup documentation)

## 🚀 Getting Started

### Using this template

1. Click the "Use this template" button above
2. Create a new repository
3. Clone your new repository:
```bash
git clone https://github.com/your-username/your-project-name.git
cd your-project-name
```

### Installation

1. Install dependencies
```bash
npm install
# or
yarn install
```

2. Configure environment variables
```bash
cp .env.example .env.local
```
Edit the `.env.local` file with your settings:
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

3. Start development server
```bash
npm run dev
# or
yarn dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

## 🔒 Security Features

### Password Requirements
- Minimum 8 characters
- Maximum 30 characters
- At least one uppercase letter (A-Z)
- At least one lowercase letter (a-z)
- At least one number (0-9)
- At least one special character (@$!%?&)

### Role-Based Access Control
- **Basic User**: Standard access to personal features
- **Admin**: Full system access and management capabilities

## 🎨 Customization

### Styling
- Update theme colors in `tailwind.config.js`
- Modify global styles in `src/styles/globals.css`
- Edit component styles in their respective files

### Components
- Add new components in `src/components`
- Update existing components to match your needs
- Follow the established patterns for consistency

## 🤝 Contributing

1. Fork the template
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This template is under the MIT license. See the [LICENSE](LICENSE) file for more details.

## ✨ Template Author

Created with ❤️ by [Werner](https://github.com/wernerjr)

---

⭐️ If you find this template helpful, please star the repository!

### Template Support
For questions and support, please open an issue in the repository.
