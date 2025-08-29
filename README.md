# LinkShala 🚀

A professional SaaS application for sharing and managing curated links. Built with React, Node.js, Express, and MongoDB with AI-powered descriptions.

## ✨ Features

- **🎨 Professional UI**: Modern, responsive design with smooth animations
- **🔍 Smart Search**: Advanced search and filtering capabilities
- **🤖 AI Descriptions**: Auto-generated descriptions using Groq/Gemini APIs
- **📊 Analytics**: Track clicks and shares
- **🔐 Admin Dashboard**: Secure admin panel at `/dashboard`
- **📱 Mobile-First**: Fully responsive across all devices
- **⚡ Fast Performance**: Optimized with Vite + React frontend
- **🗄️ MongoDB Integration**: Scalable database with full CRUD operations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud)
- npm or yarn

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

Copy `.env.example` to `.env` and update values:

```bash
cp .env.example .env
```

**Required Environment Variables:**
```env
MONGODB_URI=mongodb://localhost:27017/linkshala
JWT_SECRET=your-super-secret-jwt-key
ADMIN_PASSWORD=your-secure-admin-password
PORT=5000
NODE_ENV=development

# Optional - for AI descriptions
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
```

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
- **Frontend**: http://localhost:5173
- **Admin Dashboard**: http://localhost:5173/dashboard
- **API**: http://localhost:5000/api

## 🏗️ Architecture

### Frontend (React + Vite)
- Modern React 18 with hooks
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

### Admin API (Requires Authentication)
- `POST /api/admin/login` - Admin authentication
- `GET /api/admin/links` - Get all links
- `POST /api/admin/links` - Create new link
- `PUT /api/admin/links/:id` - Update existing link
- `DELETE /api/admin/links/:id` - Delete link
- `POST /api/admin/links/bulk` - Bulk create links

## 🤖 AI Features

LinkShala automatically generates descriptions for links using:
- **Groq API**: Fast inference with Mixtral model
- **Gemini API**: Google's Gemini Pro as fallback
- **Smart Fallback**: Creative descriptions if APIs fail

## 🔐 Admin Dashboard

Access the admin dashboard at `/dashboard` with your configured password.

**Admin Features:**
- 📊 Analytics Dashboard
- ➕ Link Management (CRUD operations)
- 📤 Bulk Upload (JSON format)
- 🔍 Advanced Search
- 📈 Performance Tracking

## 🛠 Tech Stack

### Frontend
- React 18, Vite, TailwindCSS, Framer Motion, Lucide React

### Backend
- Node.js, Express.js, MongoDB, Mongoose, JWT, Axios

### AI Integration
- Groq API, Gemini API

## 📱 Responsive Design

Fully responsive and optimized for all devices (320px+).

## 🚀 Production Deployment

### Environment Variables
Update your production environment variables:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/linkshala
JWT_SECRET=your-production-secret-key
ADMIN_PASSWORD=your-secure-admin-password
PORT=5000
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