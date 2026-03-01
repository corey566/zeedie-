
<div align="center">

# ZEEDIE Portfolio

### Creative Engineer | Full Stack Developer

![Portfolio Preview](client/public/opengraph.jpg)

[![License: MIT](https://img.shields.io/badge/License-MIT-black.svg)](https://opensource.org/licenses/MIT)
[![Node](https://img.shields.io/badge/Node.js-20+-black)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-black)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-black)](https://www.postgresql.org/)

[Live Demo](https://your-app.replit.app) · [Report Bug](https://github.com/yourusername/portfolio/issues) · [Request Feature](https://github.com/yourusername/portfolio/issues)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Configuration](#-configuration)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Overview

A modern, Swiss-inspired developer portfolio built with a minimalist white design aesthetic featuring 3D animations, smooth transitions, and an intuitive admin panel for content management. This full-stack application showcases professional work, experience, skills, and blog posts with a clean, elegant interface.

### Design Philosophy

- **Minimalist White Design**: Clean, distraction-free interface with subtle accents
- **Swiss Typography**: Space Grotesk for headings, Inter for body text
- **Rounded Corners**: Consistent 1.5rem (24px) border radius throughout
- **Smooth Animations**: Framer Motion for transitions, GSAP for scroll effects
- **3D Elements**: Three.js interactive background elements

---

## ✨ Features

### 🎨 Frontend
- **Interactive Hero Section** with 3D Three.js background animations
- **Portfolio Showcase** with project cards and detailed views
- **Professional Timeline** displaying work experience
- **Skills Matrix** organized by category (Frontend, Backend, DevOps, etc.)
- **Blog System** with rich text editor support
- **GitHub Integration** showing contribution graph
- **LinkedIn Feed** displaying recent posts
- **Contact Form** with social links
- **Responsive Design** optimized for all devices
- **Smooth Page Transitions** using Framer Motion

### 🔧 Backend
- **RESTful API** built with Express.js
- **PostgreSQL Database** with Drizzle ORM
- **Admin Authentication** with session management
- **GitHub API Integration** for contribution sync
- **Media Management** for project images
- **CRUD Operations** for all content types
- **Auto-migrations** on application startup

### 🛡️ Admin Panel
- **Profile Management**: Update name, bio, location, and stats
- **Project Management**: Add/edit projects with images and sections
- **Blog Editor**: Rich text editor with image support
- **Experience Timeline**: Manage work history
- **Skills Organization**: Categorize technical skills
- **Social Links**: Configure contact methods
- **Site Configuration**: Update hero text and SEO settings
- **GitHub Sync**: Fetch contribution data

---

## 🛠️ Tech Stack

### Frontend
```
React 19.2         - UI library
TypeScript 5.6     - Type safety
Vite 7.1          - Build tool & dev server
Wouter 3.3        - Lightweight routing
TanStack Query 5   - Server state management
Tailwind CSS 4     - Utility-first styling
Framer Motion 12   - Animation library
GSAP 3            - Advanced animations
Three.js          - 3D graphics
shadcn/ui         - UI component library
```

### Backend
```
Node.js 20        - Runtime environment
Express.js 4      - Web framework
TypeScript 5.6    - Type safety
PostgreSQL 16     - Database
Drizzle ORM 0.39  - Type-safe database queries
Zod 3.25          - Schema validation
Express Session   - Authentication
@octokit/rest     - GitHub API client
```

### DevOps
```
Replit            - Hosting & deployment
Nix               - Package management
Drizzle Kit       - Database migrations
esbuild           - Server bundling
```

---

## 📸 Screenshots

### Home Page
![Home Page](screenshots/home.png)
*Hero section with 3D background and featured projects*

### Projects Gallery
![Projects](screenshots/projects.png)
*Portfolio showcase with category filtering*

### Admin Dashboard
![Admin Panel](screenshots/admin.png)
*Content management interface*

### Blog System
![Blog](screenshots/blog.png)
*Article listing and rich text editor*

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 16+ database
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/portfolio.git
   cd portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://user:password@host:5432/database
   ADMIN_USERNAME=your_admin_username
   ADMIN_PASSWORD=your_secure_password
   SESSION_SECRET=your_session_secret_key
   PORT=5000
   ```

4. **Run database migrations**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to `http://localhost:5000`

### First Time Setup

1. Visit `/admin/login` and log in with your credentials
2. Update your profile information
3. Add your projects, experience, and skills
4. Configure site settings (hero text, SEO)
5. Optionally sync GitHub contributions

---

## 📁 Project Structure

```
portfolio/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── ui/       # shadcn/ui components
│   │   │   ├── Navigation.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── ...
│   │   ├── pages/        # Route page components
│   │   │   ├── Home.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Admin.tsx
│   │   │   └── ...
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utilities & API functions
│   │   ├── config/       # Configuration files
│   │   ├── App.tsx       # Root component
│   │   └── main.tsx      # Entry point
│   ├── public/           # Static assets
│   └── index.html        # HTML template
│
├── server/               # Express backend
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database access layer
│   ├── auth-config.ts    # Authentication setup
│   ├── github.ts         # GitHub API integration
│   ├── index.ts          # Server entry point
│   └── vite.ts           # Vite dev server integration
│
├── shared/               # Shared code
│   └── schema.ts         # Drizzle database schema
│
├── db/                   # Database setup
│   └── index.ts          # Database connection
│
├── script/               # Utility scripts
│   ├── build.ts          # Production build script
│   └── seed.ts           # Database seeding
│
├── .env                  # Environment variables
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── vite.config.ts        # Vite config
├── drizzle.config.ts     # Drizzle ORM config
└── tailwind.config.ts    # Tailwind CSS config
```

---

## ⚙️ Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes | - |
| `ADMIN_USERNAME` | Admin panel username | ✅ Yes | - |
| `ADMIN_PASSWORD` | Admin panel password | ✅ Yes | - |
| `SESSION_SECRET` | Session encryption key | ⚠️ Recommended | Auto-generated |
| `PORT` | Server port | ❌ No | `5000` |

### Site Configuration

Edit `client/src/config/site-config.json`:

```json
{
  "hero": {
    "title": "CREATIVE",
    "subtitle": "ENGINEER",
    "description": "Full Stack Developer",
    "established": "EST. 2024",
    "version": "PORTFOLIO V1"
  },
  "seo": {
    "title": "ZEEDIE | Creative Engineer",
    "description": "Portfolio of ZEEDIE - Full Stack Developer",
    "keywords": "full stack developer, web developer, UI/UX, portfolio",
    "author": "ZEEDIE",
    "ogImage": "/opengraph.jpg"
  }
}
```

---

## 🗄️ Database Schema

### Tables

- **users** - Admin user accounts
- **profile** - Personal profile information
- **projects** - Portfolio projects
- **projectSections** - Project detail sections
- **mediaItems** - Project images and media
- **blogPosts** - Blog articles
- **experience** - Work history
- **skills** - Technical skills
- **socials** - Social media links
- **footerLinks** - Footer navigation
- **linkedinPosts** - LinkedIn feed items
- **githubContributions** - GitHub activity data
- **aboutBlocks** - About page content sections

### Auto-Migration

The application automatically syncs the database schema on startup using Drizzle Kit:

```bash
npm run db:push
```

---

## 🔌 API Endpoints

### Public Endpoints

```
GET  /api/profile              - Get profile information
GET  /api/projects             - List all projects
GET  /api/projects/:id         - Get project details
GET  /api/blog-posts           - List blog posts
GET  /api/blog-posts/:id       - Get blog post
GET  /api/experience           - Get work experience
GET  /api/skills               - Get skills by category
GET  /api/socials              - Get social links
GET  /api/linkedin-posts       - Get LinkedIn feed
GET  /api/github-contributions - Get GitHub activity
GET  /api/site-config          - Get site configuration
```

### Protected Endpoints (Admin)

```
POST /api/admin/login          - Admin login
GET  /api/admin/verify         - Verify session
POST /api/admin/logout         - Admin logout

PUT  /api/profile              - Update profile
POST /api/projects             - Create project
PUT  /api/projects/:id         - Update project
DELETE /api/projects/:id       - Delete project

POST /api/blog-posts           - Create blog post
PUT  /api/blog-posts/:id       - Update blog post
DELETE /api/blog-posts/:id     - Delete blog post

... (similar CRUD for all resources)

POST /api/github/sync          - Sync GitHub contributions
```

---

## 🌐 Deployment

### Deploy on Replit

1. **Fork or Import** this repository to Replit

2. **Add Secrets** (Environment Variables):
   - Go to Tools → Secrets
   - Add `DATABASE_URL`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`

3. **Provision Database**:
   - Click Tools → Database
   - PostgreSQL database will be auto-created
   - `DATABASE_URL` is automatically set

4. **Deploy**:
   - Click "Deploy" button
   - Choose deployment tier
   - Configure:
     ```
     Build: npm run build
     Run: node dist/index.cjs
     ```

5. **Custom Domain** (Optional):
   - Go to deployment settings
   - Add your custom domain
   - Configure DNS records

### Production Checklist

- ✅ Set strong `ADMIN_PASSWORD`
- ✅ Configure `SESSION_SECRET`
- ✅ Update SEO metadata
- ✅ Add custom domain
- ✅ Test all admin functions
- ✅ Verify GitHub integration
- ✅ Check responsive design
- ✅ Run performance audit

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test thoroughly before submitting
- Update documentation as needed

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- Design inspired by Swiss typography and minimalism
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Animations powered by [Framer Motion](https://www.framer.com/motion/)
- 3D graphics using [Three.js](https://threejs.org/)

---

<div align="center">

### Built with ❤️ by ZEEDIE

**EST. 2024** · **PORTFOLIO V1**

[Website](https://your-portfolio.dev) · [LinkedIn](https://linkedin.com/in/yourprofile) · [GitHub](https://github.com/yourusername)

</div>
