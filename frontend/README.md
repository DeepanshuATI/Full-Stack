# CodeArena - LeetCode Clone Frontend

A modern, production-ready frontend for a coding problem-solving platform similar to LeetCode, CodeChef, and Codeforces.

## Features

- 🎨 **Dual Theme Support**: Light and dark mode with smooth transitions
- 🔐 **Authentication System**: Login/Register with user and admin roles
- 📝 **Problem Dashboard**: Browse, search, and filter coding problems
- 💻 **Code Editor**: Monaco editor with syntax highlighting for multiple languages
- ✅ **Test Runner**: Execute code and view test results
- 👨‍💼 **Admin Panel**: Add, edit, and delete problems
- 📱 **Responsive Design**: Works seamlessly on all devices
- ⚡ **Fast & Modern**: Built with React 18 and Vite

## Tech Stack

- **React 18** - UI library
- **React Router v6** - Client-side routing
- **Tailwind CSS** - Utility-first styling
- **Monaco Editor** - Code editor (VS Code's editor)
- **Lucide React** - Beautiful icons
- **Axios** - HTTP client
- **Vite** - Build tool and dev server

## Getting Started

### Prerequisites

- Node.js 16+ and npm/yarn

### Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── Navbar.jsx
│   │   ├── AuthModal.jsx
│   │   ├── ProblemList.jsx
│   │   └── CodeEditor.jsx
│   ├── pages/            # Page components
│   │   ├── Dashboard.jsx
│   │   ├── ProblemPage.jsx
│   │   └── AdminDashboard.jsx
│   ├── context/          # React context providers
│   │   ├── AuthContext.jsx
│   │   └── ThemeContext.jsx
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── public/               # Static assets
├── index.html           # HTML template
├── vite.config.js       # Vite configuration
├── tailwind.config.js   # Tailwind configuration
└── package.json         # Dependencies

```

## Features Overview

### User Features

- **Browse Problems**: View all available coding problems with difficulty levels
- **Search & Filter**: Find problems by title or filter by difficulty
- **Solve Problems**: Write code in an integrated editor with syntax highlighting
- **Run Tests**: Execute code and see test results in real-time
- **Multi-language Support**: Write solutions in JavaScript, Python, or Java

### Admin Features

- **Add Problems**: Create new coding problems with descriptions, examples, and test cases
- **Edit Problems**: Update existing problem details
- **Delete Problems**: Remove problems from the platform
- **Manage Content**: Full CRUD operations for problem management

## Backend Integration

The frontend is ready to integrate with your backend API. Update the API endpoints in the components:

- Authentication: `AuthModal.jsx`
- Problem fetching: `Dashboard.jsx`, `ProblemPage.jsx`
- Code execution: `ProblemPage.jsx`
- Admin operations: `AdminDashboard.jsx`

The Vite config includes a proxy setup for `/api` requests to `http://localhost:5000`.

## Customization

### Theme Colors

Edit `tailwind.config.js` to customize the color scheme:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Your custom colors
      }
    }
  }
}
```

### Branding

Update the app name in:
- `index.html` - Page title
- `Navbar.jsx` - Logo text

## License

MIT
