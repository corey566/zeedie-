# Mohamed Yazeed Faumy - Developer Portfolio PRD

## Project Overview
Developer portfolio site with immersive 3D Three.js animations, showcasing IT Manager / Technical Operations Lead experience.

## Original Problem Statement
Improve developer portfolio - fix content conflicts between blogs/projects, add 3D elements and Three.js animations, make UI more modern and standardized.

## User Persona
- Mohamed Yazeed Faumy
- IT Manager / Technical Operations Lead
- 5+ years experience in cloud infrastructure, VoIP, SaaS platforms
- Target audience: Recruiters, potential employers, clients

## Core Requirements (Static)
- [x] Clean white/minimal theme
- [x] Immersive 3D Three.js animations
- [x] Projects section with technology tags
- [x] Blog section with published/draft separation
- [x] Experience timeline from resume
- [x] Skills categorized by domain
- [x] Contact information with social links
- [x] Admin panel for content management

## What's Been Implemented

### Phase 1 (April 1, 2026)
1. **Backend Migration** - Migrated from Replit PostgreSQL to Emergent FastAPI + MongoDB
2. **Content Conflict Fix** - Separated blog API endpoints
3. **3D Immersive Experience** - Enhanced ThreeScene.tsx with particles, shapes
4. **Resume Data Integration** - Updated with actual content

### Phase 2 (April 2, 2026)
1. **Dark Mode Toggle** - Full dark mode support with theme persistence
2. **PDF Resume Download** - Generate and download resume as text file
3. **GitHub Integration APIs** - Real GitHub contributions sync endpoint
4. **Data Export/Import** - JSON and SQL export for easy deployment
5. **Project Detail Pages** - Working with content sections support

## Tech Stack
- **Frontend**: React 19, Vite 7, TypeScript, Tailwind CSS 4
- **3D**: Three.js, @react-three/fiber, @react-three/drei
- **Backend**: FastAPI, Motor (MongoDB async driver)
- **Database**: MongoDB

## API Endpoints (Complete)

### Core
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/health | GET | Health check |
| /api/profile | GET/PUT | Profile data |
| /api/site-config | GET/PUT | Site configuration |

### Content
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/projects | GET/POST | All projects |
| /api/projects/featured | GET | Featured only |
| /api/projects/:id | GET/PUT/DELETE | Single project |
| /api/projects/:id/sections | GET/POST | Project sections |
| /api/blog | GET | Published posts |
| /api/blog/all | GET | All posts |
| /api/experience | GET/POST | Work experience |
| /api/skills | GET/POST | Skills list |
| /api/socials | GET/POST | Social links |

### New Features
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/theme | GET/PUT | Theme settings |
| /api/resume/generate | GET | Generate resume data |
| /api/export | GET | Export all data as JSON |
| /api/import | POST | Import data from JSON |
| /api/github-sync-real | POST | Sync real GitHub contributions |
| /api/github-repos | GET | Fetch GitHub repos |

## Data Export Files
- `/app/portfolio_data_export.json` - MongoDB JSON export
- `/app/portfolio_data_import.sql` - PostgreSQL SQL statements

## Remaining/Future Features
- [ ] Real LinkedIn API integration (requires OAuth)
- [ ] Blog post content editor improvements
- [ ] Contact form with email notification
- [ ] Analytics tracking
- [ ] Image upload for projects

## Admin Access
- URL: /admin
- Username: admin
- Password: admin123
