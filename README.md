# LinkShala 🚀

A professional SaaS application for sharing and managing curated links. Built with React, Node.js, Express, and MongoDB with AI-powered descriptions.

## ✨ Features

- **🔐 Authentication**: Secure user authentication with Supabase
- **🎨 Professional UI**: Modern, responsive design with smooth animations
- **🔍 Smart Search**: Advanced search and filtering capabilities
- **🤖 AI Descriptions**: Auto-generated descriptions using Groq/Gemini APIs
- **📊 Analytics**: Track clicks and shares
- **🔐 Admin Dashboard**: Secure admin panel 
- **📱 Mobile-First**: Fully responsive across all devices
- **⚡ Fast Performance**: Optimized with Vite + React frontend
- **🗄️ MongoDB Integration**: Scalable database with full CRUD operations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- Supabase account (free tier works)
- npm 

### 1. Clone and Install
```bash
git clone <your-repo>
cd LinkShala

# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
```

### 2. Environment Setup

**Frontend (.env in FinalLSSS folder):**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_URL=http://localhost:5002/api
```

**Backend (.env in server folder):**
```env
MONGODB_URI=mongodb://localhost:27017/linkshala
ADMIN_PASSWORD=your-secure-admin-password
PORT=5002
NODE_ENV=development

# Optional - for AI descriptions
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
```

**📖 See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed Supabase configuration**

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# Populate database with sample data
cd server
npm run migrate
```

### 4. Start Development Servers

**Backend:**
```bash
cd server
npm run dev
```

**Frontend:**
```bash
npm run dev
```

### 5. Access the Application
- **Landing Page**: http://localhost:5173
- **App (after login)**: http://localhost:5173/home
- **API**: http://localhost:5002/api

## 🏗️ Architecture

### Frontend (React + Vite)
- Modern React 18 with hooks
- Supabase authentication
- TailwindCSS for styling
- Framer Motion for animations
- Responsive design system

### Backend (Node.js + Express)
- RESTful API architecture
- JWT authentication
- MongoDB integration
- AI description generation

### Database (MongoDB)
- Flexible document structure
- Full-text search indexing
- Analytics tracking
- Scalable data model

## 📋 API Endpoints

### Public API
- `GET /api/links` - Get all links with filtering
- `GET /api/links/:id` - Get single link (increments click count)
- `POST /api/links/:id/share` - Increment share count



## 🛠 Tech Stack

### Frontend
- React 18, Vite, Supabase, TailwindCSS, Framer Motion, Lucide React

### Backend
- Node.js, Express.js, MongoDB, Mongoose, JWT, Axios

### AI Integration
- Groq API, Gemini API

## 📱 Responsive Design

Fully responsive and optimized for all devices (320px+).

## 🚀 Production Deployment

### Environment Variables
Update your production environment variables:

**Frontend:**
```env
VITE_SUPABASE_URL=your_production_supabase_url
VITE_SUPABASE_ANON_KEY=your_production_supabase_key
VITE_API_URL=https://your-api-domain.com/api
```

**Backend:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkshala
JWT_SECRET=your-production-secret-key
PORT=5002
NODE_ENV=production
GEMINI_API_KEY=your-production-gemini-key
GROQ_API_KEY=your-production-groq-key
```

### Build Commands
```bash
# Build frontend
npm run build

# Start production server
cd server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use for your own projects!

---

**Built with ❤️ for the developer community**
