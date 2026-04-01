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

## What's Been Implemented (April 1, 2026)
1. **Backend Migration** - Migrated from Replit PostgreSQL to Emergent FastAPI + MongoDB
   - Created `/app/backend/server.py` with 13+ API endpoints
   - All CRUD operations for projects, blogs, experience, skills, socials
   
2. **Content Conflict Fix** - Separated blog API endpoints:
   - `/api/blog` - Returns only published posts (public)
   - `/api/blog/all` - Returns all posts (admin)

3. **3D Immersive Experience** - Enhanced ThreeScene.tsx:
   - Animated floating particles
   - Distorted sphere with metallic material
   - Wireframe icosahedron
   - Torus knot decorations
   - Mouse-following interactive element
   - Grid plane for depth

4. **Resume Data Integration** - Updated with actual content:
   - Port City BPO, Code Studio Global, Freelance, Sterling Carter Technology
   - Skills: AWS, Python, VoIP, Project Management, etc.
   - Contact: 2002yazeedfaumy@gmail.com

5. **UI Updates**:
   - Navigation brand: "ZEEDIE" → "MYF"
   - Footer updated with dynamic profile name
   - Modern typography with Syne + DM Sans fonts

## Tech Stack
- **Frontend**: React 19, Vite 7, TypeScript, Tailwind CSS 4
- **3D**: Three.js, @react-three/fiber, @react-three/drei
- **Backend**: FastAPI, Motor (MongoDB async driver)
- **Database**: MongoDB

## P0/P1/P2 Features Remaining

### P0 (Critical) - DONE
- [x] Fix content conflict bugs
- [x] 3D Three.js animations
- [x] Resume data integration

### P1 (High Priority)
- [ ] GitHub API integration for real contribution data
- [ ] LinkedIn API integration for real posts
- [ ] Project detail pages with sections
- [ ] Blog post content editor (TipTap)

### P2 (Nice to Have)
- [ ] Dark mode toggle
- [ ] PDF resume download
- [ ] Contact form with email notification
- [ ] Analytics tracking

## API Endpoints
| Endpoint | Method | Description |
|----------|--------|-------------|
| /api/profile | GET/PUT | Profile data |
| /api/projects | GET/POST | All projects |
| /api/projects/featured | GET | Featured only |
| /api/projects/:id | GET/PUT/DELETE | Single project |
| /api/blog | GET | Published posts |
| /api/blog/all | GET | All posts |
| /api/blog/:id | GET/PUT/DELETE | Single post |
| /api/experience | GET/POST | Work experience |
| /api/skills | GET/POST | Skills list |
| /api/socials | GET/POST | Social links |
| /api/site-config | GET/PUT | Site configuration |
| /api/seed | POST | Seed database |

## Admin Access
- URL: /admin
- Username: admin
- Password: admin123
