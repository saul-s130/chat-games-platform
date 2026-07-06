# Chat & Games Platform - Backend

## Setup

### Prerequisites
- Node.js (v14 or higher)

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file in the backend folder:

```
PORT=5000
JWT_SECRET=your_super_secret_key_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

### Running

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server runs on: **http://localhost:5000**

## How Data Storage Works

This version uses **file-based storage** instead of MongoDB:
- Data is saved in JSON files in the `data/` folder
- Files are created automatically:
  - `data/users.json` - User accounts
  - `data/chat.json` - Chat messages
  - `data/announcements.json` - Admin announcements
- Perfect for small deployments (up to ~100 users)

## API Endpoints

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Users
- `GET /api/users` - Get all users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile

### Chat
- `GET /api/chat` - Get chat messages
- `POST /api/chat` - Send message (via API)

### Admin
- `GET /api/admin/chat/all` - View all messages
- `POST /api/admin/users/:userId/ban` - Ban user
- `POST /api/admin/users/:userId/unban` - Unban user
- `PUT /api/admin/users/:userId/role` - Update user role
- `POST /api/admin/announcements` - Create announcement
- `GET /api/admin/announcements` - Get announcements

## Socket.io Events

### Client → Server
- `send-message` - Send chat message
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server → Client
- `receive-message` - New message received
- `typing` - Someone is typing
- `stop-typing` - Someone stopped typing
- `user-left` - User disconnected

## Deployment

This backend is designed for easy deployment to free hosting services like:
- **Render** (https://render.com) - Free tier
- **Railway** (https://railway.app) - Free tier
- **Fly.io** (https://fly.io) - Free tier

All data files will be stored on the server and persist between restarts.