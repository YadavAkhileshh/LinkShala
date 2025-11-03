# LinkShala 🚀

A professional platform for discovering and sharing curated developer resources. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

- **🔐 Secure Authentication**: Google OAuth and email/password login with Supabase
- **🎨 Modern UI**: Beautiful, responsive design with smooth animations
- **🔍 Smart Search**: Advanced search and filtering by categories and tags
- **🤖 AI-Powered**: Auto-generated descriptions using Groq/Gemini APIs
- **📊 Analytics**: Track link clicks, shares, and referrals
- **🔖 Bookmarks**: Save your favorite links with database sync
- **📱 Mobile-First**: Fully responsive across all devices
- **⚡ Fast Performance**: Optimized with Vite + React
- **🗄️ Scalable**: MongoDB database with full-text search
- **👨‍💼 Admin Dashboard**: Professional analytics with visualizations

> 📖 **See [FEATURES.md](./FEATURES.md) for complete feature list and roadmap**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Supabase account (free tier)
- Gmail account (for authentication) 

### 1. Clone and Install
```bash
git clone https://github.com/yourusername/linkshala.git
cd linkshala

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
PORT=5002
NODE_ENV=development

# Optional - for AI-powered descriptions
GEMINI_API_KEY=your-gemini-api-key
GROQ_API_KEY=your-groq-api-key
```

**Supabase Setup:**
1. Create a project at [supabase.com](https://supabase.com)
2. Go to Settings → API to get your URL and anon key
3. Enable Google OAuth in Authentication → Providers
4. Configure email settings in Authentication → Email Templates
5. Add redirect URL: `http://localhost:5173/**`

### 3. Database Setup
```bash
# Start MongoDB (if local)
mongod

# The database will be populated automatically on first run
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
- **Home (after login)**: http://localhost:5173/home
- **Bookmarks**: http://localhost:5173/bookmarks

## 🏗️ Architecture

### Frontend
- React 18 with hooks and context API
- Supabase authentication (Google OAuth + Email)
- TailwindCSS for styling
- Framer Motion for animations
- Responsive design system

### Backend
- RESTful API with Express.js
- MongoDB with Mongoose ODM
- AI-powered description generation
- Click and share analytics

### Database
- MongoDB for links and categories
- Supabase for user bookmarks
- Full-text search indexing
- Real-time analytics tracking

## 📋 API Endpoints

### Links
- `GET /api/links` - Get all links with pagination and filters
- `GET /api/links/:id` - Get single link details
- `POST /api/links/:id/share` - Increment share count
- `POST /api/links/:id/referral` - Track referral clicks

### Categories
- `GET /api/links/categories` - Get all categories with link counts

### Admin
- `POST /admin/login` - Admin authentication
- `GET /admin/stats` - Dashboard statistics
- `GET /admin/links` - Manage all links
- `POST /admin/links` - Create new link
- `PUT /admin/links/:id` - Update link
- `DELETE /admin/links/:id` - Delete link


## 🛠 Tech Stack

- **Frontend**: React 18, Vite, Supabase, TailwindCSS, Framer Motion, Lucide React
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, Axios
- **AI**: Groq API, Gemini API
- **Authentication**: Supabase Auth (Google OAuth + Email/Password)
- **Database**: MongoDB Atlas, Supabase PostgreSQL

## 🎨 Design Features

- Vintage-inspired color palette with dark mode support
- Smooth animations and transitions
- Fully responsive (320px to 4K displays)
- Accessible and keyboard-friendly

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

## 🔒 Security

- Gmail-only authentication for verified users
- Secure password hashing with Supabase
- Environment variables for sensitive data
- CORS protection on API endpoints

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - feel free to use for your own projects!

---

**Built with ❤️ for developers, by developer**
