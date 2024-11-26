# MERN User Role Management System

A full-stack web application for managing users and roles with dynamic permissions, built using the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- **User Management**
  - Create, read, update, and delete users
  - Assign roles to users
  - Set user status (active/inactive)

- **Role Management**
  - Create and manage roles with custom permissions
  - Dynamic permission system for different resources
  - Granular control over user actions

- **Authentication & Authorization**
  - JWT-based authentication
  - Protected routes
  - Role-based access control

## Tech Stack

- **Frontend**
  - React 18
  - Material-UI (MUI)
  - React Router DOM
  - Axios
  - Context API for state management

- **Backend**
  - Node.js
  - Express.js
  - MongoDB with Mongoose
  - JWT for authentication
  - bcryptjs for password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or remote instance)
- npm or yarn package manager

## Getting Started

1. **Clone the repository**

```bash
git clone <repository-url>
cd mern-user-role-management
```

2. **Install dependencies**

```bash
# Install server dependencies
npm install

# Install client dependencies
cd client
npm install
```

3. **Environment Setup**

Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/user-management
JWT_SECRET=your-secret-key-change-this-in-production
PORT=5000
```

4. **Run the application**

```bash
# Run server and client concurrently
npm run dev

# Run server only
npm run server

# Run client only
npm run client
```

The application will be available at:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Default Credentials

```
Email: admin@example.com
Password: admin123
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Users
- `GET /api/users` - Get all users
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Roles
- `GET /api/roles` - Get all roles
- `POST /api/roles` - Create new role
- `PUT /api/roles/:id` - Update role
- `DELETE /api/roles/:id` - Delete role

## Project Structure

```
├── server/
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── setup/           # Database initialization
│   └── index.js         # Server entry point
├── src/
│   ├── components/      # React components
│   ├── context/         # Context providers
│   ├── pages/           # Page components
│   ├── utils/           # Utility functions
│   ├── App.jsx         # Root component
│   └── main.jsx        # Entry point
└── package.json
```

## Security Features

- Password hashing using bcryptjs
- JWT token authentication
- Protected API routes
- Role-based access control
- Secure HTTP headers

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
