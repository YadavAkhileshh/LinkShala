# Setup Guide

## Quick Setup

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd LinkShala
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd server
npm install
```

3. **Environment setup**
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your values
```

4. **Database setup**
```bash
# Make sure MongoDB is running
# Then populate with sample data
cd server
npm run migrate
```

5. **Start development**
```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
npm run dev
```

6. **Access application**
- Frontend: http://localhost:5173
- Admin: http://localhost:5173/dashboard

## Environment Variables

Required:
- `MONGODB_URI` - Your MongoDB connection string
- `JWT_SECRET` - Secret for JWT tokens
- `ADMIN_PASSWORD` - Password for admin access

Optional (for AI descriptions):
- `GEMINI_API_KEY` - Google Gemini API key
- `GROQ_API_KEY` - Groq API key

## Database Migration

The migration script creates sample data:
```bash
cd server
npm run migrate
```

This will populate your database with 10 sample links across different categories.

## Admin Access

- URL: `/dashboard`
- Password: Set in your `.env` file as `ADMIN_PASSWORD`

## Troubleshooting

1. **MongoDB connection issues**: Ensure MongoDB is running and connection string is correct
2. **Port conflicts**: Change PORT in `.env` if 5001 is occupied
3. **API keys**: AI descriptions are optional - app works without them