# Sailing Camps Application

A full-stack web application for managing sailing camp registrations and administration.

## Features

-   User registration for sailing camps
-   Admin dashboard for managing applications
-   Photo upload functionality
-   Excel export of applications
-   Responsive design
-   Authentication system

## Tech Stack

-   Frontend: React.js
-   Backend: Node.js, Express.js
-   Database: MongoDB
-   Authentication: JWT

## Prerequisites

-   Node.js (v14 or higher)
-   MongoDB
-   npm or yarn

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/sailing-camps.git
cd sailing-camps
```

2. Install frontend dependencies:

```bash
npm install
```

3. Install backend dependencies:

```bash
cd server
npm install
```

4. Create a .env file in the server directory with the following variables:

```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5001
```

## Running the Application

1. Start the backend server:

```bash
cd server
npm start
```

2. In a new terminal, start the frontend:

```bash
npm start
```

The application will be available at http://localhost:3000

## Admin Access

Default admin credentials:

-   Username: admin
-   Password: admin123

## License

MIT
