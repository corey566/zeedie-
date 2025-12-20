# Replit.md - Developer Portfolio

## Overview

This is a modern, Swiss-inspired developer portfolio application built as a full-stack web application. The project showcases a professional developer's work, experience, skills, and blog posts with a minimalist white design aesthetic, 3D animations, and smooth transitions.

The application serves as a personal branding platform featuring:
- Interactive hero section with 3D Three.js elements
- Portfolio project showcase
- Professional experience timeline
- Skills categorization
- Blog/journal system
- Contact information and social links
- Admin panel for content management
- GitHub contributions integration

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript, using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **State Management**: TanStack React Query for server state management and caching
- **Styling**: Tailwind CSS with CSS variables for theming (light mode only, pure white background)
- **UI Components**: shadcn/ui component library (New York style) with Radix UI primitives
- **Animations**: 
  - Framer Motion for page transitions and micro-interactions
  - GSAP for scroll-triggered animations
  - Three.js with @react-three/fiber for 3D elements
- **Typography**: Space Grotesk for headings, Inter for body text

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api/*`
- **Build**: Custom build script using esbuild for server bundling, Vite for client

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` - contains all table definitions
- **Migrations**: Drizzle Kit for schema migrations (`drizzle-kit push`)
- **Tables**: users, profile, projects, blogPosts, experience, skills, socials, footerLinks, linkedinPosts, githubContributions

### Project Structure
```
├── client/           # React frontend application
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route page components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and API functions
├── server/           # Express backend
│   ├── routes.ts     # API route definitions
│   ├── storage.ts    # Database access layer
│   └── github.ts     # GitHub API integration
├── shared/           # Shared code between client/server
│   └── schema.ts     # Drizzle database schema
├── db/               # Database connection setup
└── migrations/       # Database migration files
```

### Path Aliases
- `@/*` → `./client/src/*`
- `@shared/*` → `./shared/*`
- `@db` → `./db/index.ts`
- `@assets` → `./attached_assets/`

## External Dependencies

### Database
- **PostgreSQL**: Primary database, connection via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe database queries and schema management

### Third-Party APIs
- **GitHub API**: Integration via `@octokit/rest` for fetching contribution data
  - Uses Replit Connectors for OAuth token management
  - Endpoint in `server/github.ts`

### Key NPM Packages
- **UI/Animation**: framer-motion, gsap, three, @react-three/fiber, @react-three/drei
- **Data Fetching**: @tanstack/react-query
- **Form Handling**: react-hook-form, @hookform/resolvers, zod
- **Database**: drizzle-orm, pg, drizzle-zod
- **Server**: express, express-session, connect-pg-simple

### Development Tools
- **Vite Plugins**: 
  - `@replit/vite-plugin-runtime-error-modal` for error overlay
  - `@replit/vite-plugin-cartographer` for development (Replit-specific)
  - Custom `vite-plugin-meta-images` for OpenGraph image handling