# Chat & Games Platform - Backend

## Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)

### Installation

```bash
npm install
```

### Configuration

Create a `.env` file based on `.env.example`:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/chat-games
JWT_SECRET=your_jwt_secret_key_here
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
- `join-room` - Join a room
- `send-message` - Send chat message
- `typing` - User is typing
- `stop-typing` - User stopped typing

### Server → Client
- `receive-message` - New message received
- `typing` - Someone is typing
- `stop-typing` - Someone stopped typing
- `user-joined` - User joined room
- `user-left` - User left