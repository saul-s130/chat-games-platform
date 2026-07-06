# Chat & Games Platform - Frontend

## Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_SOCKET_URL=http://localhost:5000
```

### Running

```bash
# Development
npm start

# Build
npm run build

# Test
npm test
```

The app will open at `http://localhost:3000`

## Pages

- **Home** - Display announcements and platform info
- **Chat** - Real-time chat with other users
- **Games** - Coming soon games showcase
- **Admin Dashboard** - Admin panel for managing users and content (admin only)

## Features

- User authentication (register/login)
- Real-time messaging with Socket.io
- Admin dashboard for user management
- User ban/unban functionality
- Member tiers (user, premium, vip, admin)
- Announcements system