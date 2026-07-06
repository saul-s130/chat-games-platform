# 🎮 Chat & Games Platform

A real-time chat platform with game support for small communities.

## ✨ Features

✅ **Real-time Chat** - Talk to multiple users simultaneously  
✅ **User Authentication** - Secure login and registration  
✅ **Admin Dashboard** - Manage users and post announcements  
✅ **Ban System** - Remove problematic users  
✅ **User Tiers** - Different membership levels (Free, Premium, VIP, Admin)  
✅ **Games** - Placeholder for Coup, Blackjack, Cheat, Poker  
✅ **File-Based Storage** - No database needed, simple and reliable  
✅ **Easy Deployment** - Deploy to free hosting in minutes  

## 🚀 Quick Start

### Local Development

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm start
```

Website opens at: **http://localhost:3000**

### Deploy to Internet

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions to deploy to Render + Vercel (completely free).

## 📁 Project Structure

```
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── routes/   # API endpoints
│   │   ├── socket/   # Real-time chat
│   │   └── services/ # File-based storage
│   └── data/         # Stored data (auto-created)
│
├── frontend/         # React app
│   ├── src/
│   │   ├── pages/    # Login, Chat, Admin, etc
│   │   ├── components/
│   │   └── store/    # User state management
│   └── public/
│
└── DEPLOYMENT.md     # How to deploy
```

## 🔧 Tech Stack

**Backend:**
- Node.js + Express
- Socket.io (real-time)
- File-based storage (JSON)
- JWT authentication

**Frontend:**
- React + TypeScript
- Tailwind CSS
- Zustand (state management)
- Axios + Socket.io client

## 📖 API Docs

See:
- [Backend README](./backend/README.md) - API endpoints
- [Frontend README](./frontend/README.md) - Components & pages

## 🎯 For 15 Users

This setup is perfect because:
- ✅ No database complexity
- ✅ Completely free to deploy
- ✅ Data stays forever
- ✅ Easy to backup (just download JSON files)
- ✅ Scales up to ~100 users

## 📝 Next Steps

1. **Deploy:** Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
2. **Share link:** Give your users the website URL
3. **Make yourself admin:** Contact support or manually edit data
4. **Post announcements:** Use admin dashboard
5. **Add features:** Modify code and redeploy

## 📄 License

MIT - Feel free to use and modify!

---

**Questions?** Check the README files in backend/ and frontend/ folders.