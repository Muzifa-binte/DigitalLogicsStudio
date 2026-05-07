# Boolforge Frontend

Boolforge is the React frontend for Digital Logics Studio. It provides interactive digital-logic learning tools, topic pages, and the JWT-based authentication UI used by the connected backend.

## Features

- Interactive digital-logic tools such as Circuit Forge and K-Map Studio
- Topic-based learning pages for Boolean algebra, number systems, arithmetic, memory, and sequential circuits
- JWT authentication flow with login, signup, logout, persistent session restore, and navbar-based user state
- Responsive landing page with search, filtered content sections, and success alerts after authentication

## Tech Stack

- React 18
- React Router DOM
- Axios
- CSS
- Create React App

## Project Structure

```text
DigitalLogicsStudio/
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   ├── services/
│   ├── utils/
│   ├── App.js
│   └── index.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Environment

Create a local `.env` file from `.env.example`.

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Local Development

Install dependencies:

```bash
npm install
```

Start the frontend:

```bash
npm start
```

Build for production:

```bash
npm run build
```

## Backend Dependency

This frontend expects the backend to run separately from the sibling project:

```text
../DigitalLogicsStudio-Backend
```

Authentication and session restore will fail if the backend is not running on the API URL configured above.

## Authentication Flow

- Users can sign up and log in from the navbar
- After successful authentication, the app returns to the home page
- A small success alert appears on the home page
- The logged-in user name is shown in the navbar
- Logout clears the session and returns the user to the home page

## Notes

- `.env` files are ignored; `.env.example` stays tracked
- `package-lock.json` is intentionally tracked for reproducible installs

## License

Proprietary License. All rights reserved.
