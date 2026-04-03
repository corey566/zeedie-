from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, timezone
import os
import json
import httpx
import asyncpg
import secrets
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = FastAPI(title="Portfolio API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# PostgreSQL connection
DATABASE_URL = os.environ.get("DATABASE_URL", "")
pool = None

async def get_pool():
    global pool
    if pool is None:
        # Add SSL mode for external PostgreSQL
        pool = await asyncpg.create_pool(
            DATABASE_URL, 
            min_size=1, 
            max_size=10,
            ssl='require'
        )
    return pool

@app.on_event("startup")
async def startup():
    await get_pool()
    await create_tables()

@app.on_event("shutdown")
async def shutdown():
    global pool
    if pool:
        await pool.close()

# ============ Database Schema ============

async def create_tables():
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS profile (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255),
                role VARCHAR(255),
                email VARCHAR(255),
                location VARCHAR(255),
                bio TEXT,
                profile_image VARCHAR(500),
                years_experience INTEGER DEFAULT 0,
                projects_shipped INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description TEXT,
                technologies TEXT[], 
                color VARCHAR(100) DEFAULT 'bg-gray-50',
                featured BOOLEAN DEFAULT FALSE,
                project_url VARCHAR(500),
                github_url VARCHAR(500),
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                excerpt TEXT,
                content TEXT,
                tags TEXT[],
                published BOOLEAN DEFAULT TRUE,
                published_date TIMESTAMP DEFAULT NOW(),
                updated_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS experience (
                id SERIAL PRIMARY KEY,
                role VARCHAR(255) NOT NULL,
                company VARCHAR(255) NOT NULL,
                location VARCHAR(255),
                period VARCHAR(100),
                highlights TEXT[],
                sort_order INTEGER DEFAULT 0,
                is_current BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS skills (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                category VARCHAR(100),
                sort_order INTEGER DEFAULT 0
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS socials (
                id SERIAL PRIMARY KEY,
                platform VARCHAR(100) NOT NULL,
                label VARCHAR(100),
                value VARCHAR(255),
                href VARCHAR(500),
                sort_order INTEGER DEFAULT 0
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS footer_links (
                id SERIAL PRIMARY KEY,
                label VARCHAR(100) NOT NULL,
                href VARCHAR(500),
                sort_order INTEGER DEFAULT 0
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS linkedin_posts (
                id SERIAL PRIMARY KEY,
                content TEXT,
                post_date VARCHAR(100),
                likes INTEGER DEFAULT 0,
                comments INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS github_contributions (
                id SERIAL PRIMARY KEY,
                contribution_date VARCHAR(20),
                count INTEGER DEFAULT 0,
                level INTEGER DEFAULT 0
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS about_blocks (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255),
                content TEXT,
                style VARCHAR(50) DEFAULT 'light',
                image_url VARCHAR(500),
                image_position VARCHAR(50),
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS project_sections (
                id SERIAL PRIMARY KEY,
                project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
                title VARCHAR(255),
                content TEXT,
                image_url VARCHAR(500),
                image_alignment VARCHAR(50),
                image_caption VARCHAR(255),
                sort_order INTEGER DEFAULT 0,
                created_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS site_config (
                id SERIAL PRIMARY KEY,
                config_data JSONB DEFAULT '{}'::jsonb,
                updated_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        await conn.execute('''
            CREATE TABLE IF NOT EXISTS theme_settings (
                id SERIAL PRIMARY KEY,
                mode VARCHAR(20) DEFAULT 'light',
                updated_at TIMESTAMP DEFAULT NOW()
            )
        ''')
        
        print("Database tables created successfully")

# Helper to convert row to dict
def row_to_dict(row, keys):
    if row is None:
        return None
    return {k: row[i] for i, k in enumerate(keys)}

# ============ Models ============

class Profile(BaseModel):
    name: str
    role: str
    email: str
    location: Optional[str] = None
    bio: Optional[str] = None
    profileImage: Optional[str] = None
    yearsExperience: Optional[int] = None
    projectsShipped: Optional[int] = None

class Project(BaseModel):
    title: str
    description: str
    technologies: List[str]
    color: str = "bg-gray-50"
    featured: bool = False
    projectUrl: Optional[str] = None
    githubUrl: Optional[str] = None
    order: int = 0

class BlogPost(BaseModel):
    title: str
    excerpt: str
    content: str
    tags: List[str]
    published: bool = True

class Experience(BaseModel):
    role: str
    company: str
    location: Optional[str] = None
    period: str
    highlights: List[str]
    order: int = 0
    current: bool = False

# Site config default
SITE_CONFIG = {
    "hero": {
        "title": "TECH",
        "subtitle": "LEADER",
        "description": "IT Manager / Technical Operations Lead",
        "established": "EST. 2021",
        "version": "PORTFOLIO V2"
    },
    "seo": {
        "title": "Mohamed Yazeed Faumy | IT Manager & Technical Lead",
        "description": "Portfolio of Mohamed Yazeed Faumy - IT Manager / Technical Operations Lead with 5+ years of experience.",
        "keywords": "IT Manager, Technical Lead, Cloud Infrastructure, AWS, DevOps",
        "author": "Mohamed Yazeed Faumy",
        "ogImage": "/opengraph.jpg"
    }
}

# ============ Admin Auth ============

ADMIN_USERNAME = os.environ.get("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.environ.get("ADMIN_PASSWORD", "admin123")
active_tokens = set()

@app.post("/api/admin/login")
async def admin_login(data: dict):
    if data.get("username") == ADMIN_USERNAME and data.get("password") == ADMIN_PASSWORD:
        token = secrets.token_hex(32)
        active_tokens.add(token)
        return {"token": token, "success": True}
    raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/api/admin/verify")
async def admin_verify():
    return {"valid": True}

# ============ Profile ============

@app.get("/api/profile")
async def get_profile():
    p = await get_pool()
    async with p.acquire() as conn:
        row = await conn.fetchrow('SELECT * FROM profile LIMIT 1')
        if row:
            return {
                "id": row['id'],
                "name": row['name'],
                "role": row['role'],
                "email": row['email'],
                "location": row['location'],
                "bio": row['bio'],
                "profileImage": row['profile_image'],
                "yearsExperience": row['years_experience'],
                "projectsShipped": row['projects_shipped']
            }
    return {
        "id": 0,
        "name": "Mohamed Yazeed Faumy",
        "role": "IT Manager / Technical Operations Lead",
        "email": "2002yazeedfaumy@gmail.com",
        "location": "Wattala, Sri Lanka",
        "bio": "IT Manager / Technical Operations Lead with 5+ years of experience.",
        "yearsExperience": 5,
        "projectsShipped": 50
    }

@app.put("/api/profile")
async def update_profile(data: Profile):
    p = await get_pool()
    async with p.acquire() as conn:
        existing = await conn.fetchrow('SELECT id FROM profile LIMIT 1')
        if existing:
            await conn.execute('''
                UPDATE profile SET name=$1, role=$2, email=$3, location=$4, bio=$5, 
                profile_image=$6, years_experience=$7, projects_shipped=$8, updated_at=NOW()
                WHERE id=$9
            ''', data.name, data.role, data.email, data.location, data.bio,
                data.profileImage, data.yearsExperience, data.projectsShipped, existing['id'])
            return {"success": True, "id": existing['id']}
        else:
            result = await conn.fetchrow('''
                INSERT INTO profile (name, role, email, location, bio, profile_image, years_experience, projects_shipped)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
            ''', data.name, data.role, data.email, data.location, data.bio,
                data.profileImage, data.yearsExperience, data.projectsShipped)
            return {"success": True, "id": result['id']}

# ============ Projects ============

@app.get("/api/projects")
async def get_projects():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC')
        return [{
            "id": r['id'],
            "title": r['title'],
            "description": r['description'],
            "technologies": r['technologies'] or [],
            "color": r['color'],
            "featured": r['featured'],
            "projectUrl": r['project_url'],
            "githubUrl": r['github_url'],
            "order": r['sort_order']
        } for r in rows]

@app.get("/api/projects/featured")
async def get_featured_projects():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM projects WHERE featured=TRUE ORDER BY sort_order ASC')
        return [{
            "id": r['id'],
            "title": r['title'],
            "description": r['description'],
            "technologies": r['technologies'] or [],
            "color": r['color'],
            "featured": r['featured'],
            "order": r['sort_order']
        } for r in rows]

@app.get("/api/projects/{project_id}")
async def get_project(project_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        r = await conn.fetchrow('SELECT * FROM projects WHERE id=$1', project_id)
        if not r:
            raise HTTPException(status_code=404, detail="Project not found")
        return {
            "id": r['id'],
            "title": r['title'],
            "description": r['description'],
            "technologies": r['technologies'] or [],
            "color": r['color'],
            "featured": r['featured'],
            "projectUrl": r['project_url'],
            "githubUrl": r['github_url'],
            "order": r['sort_order']
        }

@app.post("/api/projects")
async def create_project(data: Project):
    p = await get_pool()
    async with p.acquire() as conn:
        result = await conn.fetchrow('''
            INSERT INTO projects (title, description, technologies, color, featured, project_url, github_url, sort_order)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
        ''', data.title, data.description, data.technologies, data.color, data.featured, 
            data.projectUrl, data.githubUrl, data.order)
        return {"success": True, "id": result['id']}

@app.put("/api/projects/{project_id}")
async def update_project(project_id: int, data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('''
            UPDATE projects SET title=COALESCE($1, title), description=COALESCE($2, description),
            technologies=COALESCE($3, technologies), color=COALESCE($4, color), featured=COALESCE($5, featured),
            sort_order=COALESCE($6, sort_order) WHERE id=$7
        ''', data.get('title'), data.get('description'), data.get('technologies'),
            data.get('color'), data.get('featured'), data.get('order'), project_id)
        return {"success": True}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('DELETE FROM projects WHERE id=$1', project_id)
        return {"success": True}

# ============ Blog Posts ============

@app.get("/api/blog")
async def get_published_blog_posts():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM blog_posts WHERE published=TRUE ORDER BY published_date DESC')
        return [{
            "id": r['id'],
            "title": r['title'],
            "excerpt": r['excerpt'],
            "content": r['content'],
            "tags": r['tags'] or [],
            "published": r['published'],
            "publishedDate": r['published_date'].isoformat() if r['published_date'] else None
        } for r in rows]

@app.get("/api/blog/all")
async def get_all_blog_posts():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM blog_posts ORDER BY published_date DESC')
        return [{
            "id": r['id'],
            "title": r['title'],
            "excerpt": r['excerpt'],
            "content": r['content'],
            "tags": r['tags'] or [],
            "published": r['published'],
            "publishedDate": r['published_date'].isoformat() if r['published_date'] else None
        } for r in rows]

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        r = await conn.fetchrow('SELECT * FROM blog_posts WHERE id=$1', post_id)
        if not r:
            raise HTTPException(status_code=404, detail="Blog post not found")
        return {
            "id": r['id'],
            "title": r['title'],
            "excerpt": r['excerpt'],
            "content": r['content'],
            "tags": r['tags'] or [],
            "published": r['published'],
            "publishedDate": r['published_date'].isoformat() if r['published_date'] else None
        }

@app.post("/api/blog")
async def create_blog_post(data: BlogPost):
    p = await get_pool()
    async with p.acquire() as conn:
        result = await conn.fetchrow('''
            INSERT INTO blog_posts (title, excerpt, content, tags, published)
            VALUES ($1, $2, $3, $4, $5) RETURNING id
        ''', data.title, data.excerpt, data.content, data.tags, data.published)
        return {"success": True, "id": result['id']}

@app.put("/api/blog/{post_id}")
async def update_blog_post(post_id: int, data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('''
            UPDATE blog_posts SET title=COALESCE($1, title), excerpt=COALESCE($2, excerpt),
            content=COALESCE($3, content), tags=COALESCE($4, tags), published=COALESCE($5, published),
            updated_at=NOW() WHERE id=$6
        ''', data.get('title'), data.get('excerpt'), data.get('content'),
            data.get('tags'), data.get('published'), post_id)
        return {"success": True}

@app.delete("/api/blog/{post_id}")
async def delete_blog_post(post_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('DELETE FROM blog_posts WHERE id=$1', post_id)
        return {"success": True}

# ============ Experience ============

@app.get("/api/experience")
async def get_experience():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM experience ORDER BY sort_order ASC, created_at DESC')
        return [{
            "id": r['id'],
            "role": r['role'],
            "company": r['company'],
            "location": r['location'],
            "period": r['period'],
            "highlights": r['highlights'] or [],
            "order": r['sort_order'],
            "current": r['is_current']
        } for r in rows]

@app.post("/api/experience")
async def create_experience(data: Experience):
    p = await get_pool()
    async with p.acquire() as conn:
        result = await conn.fetchrow('''
            INSERT INTO experience (role, company, location, period, highlights, sort_order, is_current)
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id
        ''', data.role, data.company, data.location, data.period, data.highlights, data.order, data.current)
        return {"success": True, "id": result['id']}

@app.put("/api/experience/{exp_id}")
async def update_experience(exp_id: int, data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('''
            UPDATE experience SET role=COALESCE($1, role), company=COALESCE($2, company),
            location=COALESCE($3, location), period=COALESCE($4, period), highlights=COALESCE($5, highlights),
            sort_order=COALESCE($6, sort_order), is_current=COALESCE($7, is_current) WHERE id=$8
        ''', data.get('role'), data.get('company'), data.get('location'), data.get('period'),
            data.get('highlights'), data.get('order'), data.get('current'), exp_id)
        return {"success": True}

@app.delete("/api/experience/{exp_id}")
async def delete_experience(exp_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('DELETE FROM experience WHERE id=$1', exp_id)
        return {"success": True}

# ============ Skills ============

@app.get("/api/skills")
async def get_skills():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM skills ORDER BY category ASC, sort_order ASC')
        return [{"id": r['id'], "name": r['name'], "category": r['category'], "order": r['sort_order']} for r in rows]

@app.post("/api/skills")
async def create_skill(data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        result = await conn.fetchrow('''
            INSERT INTO skills (name, category, sort_order) VALUES ($1, $2, $3) RETURNING id
        ''', data.get('name'), data.get('category'), data.get('order', 0))
        return {"success": True, "id": result['id']}

@app.delete("/api/skills/{skill_id}")
async def delete_skill(skill_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('DELETE FROM skills WHERE id=$1', skill_id)
        return {"success": True}

# ============ Socials ============

@app.get("/api/socials")
async def get_socials():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM socials ORDER BY sort_order ASC')
        return [{"id": r['id'], "platform": r['platform'], "label": r['label'], 
                 "value": r['value'], "href": r['href'], "order": r['sort_order']} for r in rows]

@app.post("/api/socials")
async def create_social(data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        result = await conn.fetchrow('''
            INSERT INTO socials (platform, label, value, href, sort_order) VALUES ($1, $2, $3, $4, $5) RETURNING id
        ''', data.get('platform'), data.get('label'), data.get('value'), data.get('href'), data.get('order', 0))
        return {"success": True, "id": result['id']}

@app.delete("/api/socials/{social_id}")
async def delete_social(social_id: int):
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('DELETE FROM socials WHERE id=$1', social_id)
        return {"success": True}

# ============ Footer Links ============

@app.get("/api/footer-links")
async def get_footer_links():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM footer_links ORDER BY sort_order ASC')
        return [{"id": r['id'], "label": r['label'], "href": r['href'], "order": r['sort_order']} for r in rows]

# ============ LinkedIn Posts ============

@app.get("/api/linkedin-posts")
async def get_linkedin_posts():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM linkedin_posts ORDER BY created_at DESC LIMIT 10')
        return [{"id": r['id'], "content": r['content'], "date": r['post_date'], 
                 "likes": r['likes'], "comments": r['comments']} for r in rows]

@app.post("/api/linkedin-posts")
async def create_linkedin_post(data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        result = await conn.fetchrow('''
            INSERT INTO linkedin_posts (content, post_date, likes, comments) VALUES ($1, $2, $3, $4) RETURNING id
        ''', data.get('content'), data.get('date'), data.get('likes', 0), data.get('comments', 0))
        return {"success": True, "id": result['id']}

# ============ GitHub Contributions ============

@app.get("/api/github-contributions")
async def get_github_contributions():
    p = await get_pool()
    async with p.acquire() as conn:
        rows = await conn.fetch('SELECT * FROM github_contributions ORDER BY contribution_date ASC')
        return [{"id": r['id'], "date": r['contribution_date'], "count": r['count'], "level": r['level']} for r in rows]

@app.post("/api/github-sync")
async def sync_github_contributions():
    import random
    p = await get_pool()
    async with p.acquire() as conn:
        await conn.execute('DELETE FROM github_contributions')
        
        today = datetime.now(timezone.utc)
        for i in range(180):
            from datetime import timedelta
            date = today - timedelta(days=(179 - i))
            count = random.randint(0, 8) if random.random() > 0.3 else 0
            level = min(count // 2 + 1, 4) if count > 0 else 0
            
            await conn.execute('''
                INSERT INTO github_contributions (contribution_date, count, level) VALUES ($1, $2, $3)
            ''', date.strftime("%Y-%m-%d"), count, level)
        
        return {"success": True, "count": 180}

# ============ Site Config ============

@app.get("/api/site-config")
async def get_site_config():
    p = await get_pool()
    async with p.acquire() as conn:
        row = await conn.fetchrow('SELECT config_data FROM site_config LIMIT 1')
        if row and row['config_data']:
            return row['config_data']
        return SITE_CONFIG

@app.put("/api/site-config")
async def update_site_config(data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        existing = await conn.fetchrow('SELECT id FROM site_config LIMIT 1')
        if existing:
            await conn.execute('UPDATE site_config SET config_data=$1, updated_at=NOW() WHERE id=$2', 
                             json.dumps(data), existing['id'])
        else:
            await conn.execute('INSERT INTO site_config (config_data) VALUES ($1)', json.dumps(data))
        return {"success": True}

# ============ Theme ============

@app.get("/api/theme")
async def get_theme():
    p = await get_pool()
    async with p.acquire() as conn:
        row = await conn.fetchrow('SELECT * FROM theme_settings LIMIT 1')
        if row:
            return {"id": row['id'], "mode": row['mode']}
        return {"id": 0, "mode": "light"}

@app.put("/api/theme")
async def update_theme(data: dict):
    p = await get_pool()
    async with p.acquire() as conn:
        existing = await conn.fetchrow('SELECT id FROM theme_settings LIMIT 1')
        mode = data.get('mode', 'light')
        if existing:
            await conn.execute('UPDATE theme_settings SET mode=$1, updated_at=NOW() WHERE id=$2', mode, existing['id'])
        else:
            await conn.execute('INSERT INTO theme_settings (mode) VALUES ($1)', mode)
        return {"success": True, "theme": {"mode": mode}}

# ============ Resume Generate ============

@app.get("/api/resume/generate")
async def generate_resume():
    p = await get_pool()
    async with p.acquire() as conn:
        profile = await conn.fetchrow('SELECT * FROM profile LIMIT 1')
        experience = await conn.fetch('SELECT * FROM experience ORDER BY sort_order ASC')
        skills = await conn.fetch('SELECT * FROM skills ORDER BY category ASC, sort_order ASC')
        projects = await conn.fetch('SELECT * FROM projects WHERE featured=TRUE ORDER BY sort_order ASC')
        socials = await conn.fetch('SELECT * FROM socials ORDER BY sort_order ASC')
        
        skills_by_category = {}
        for s in skills:
            cat = s['category'] or 'Other'
            if cat not in skills_by_category:
                skills_by_category[cat] = []
            skills_by_category[cat].append(s['name'])
        
        return {
            "profile": {"name": profile['name'], "role": profile['role'], "email": profile['email'],
                       "location": profile['location'], "bio": profile['bio']} if profile else {},
            "experience": [{"role": e['role'], "company": e['company'], "location": e['location'],
                          "period": e['period'], "highlights": e['highlights'] or []} for e in experience],
            "skills": skills_by_category,
            "projects": [{"title": p['title'], "description": p['description'], 
                         "technologies": p['technologies'] or []} for p in projects],
            "socials": [{"platform": s['platform'], "value": s['value']} for s in socials],
            "generatedAt": datetime.now(timezone.utc).isoformat()
        }

# ============ Data Export ============

@app.get("/api/export")
async def export_all_data():
    p = await get_pool()
    async with p.acquire() as conn:
        profile = await conn.fetchrow('SELECT * FROM profile LIMIT 1')
        projects = await conn.fetch('SELECT * FROM projects')
        blog_posts = await conn.fetch('SELECT * FROM blog_posts')
        experience = await conn.fetch('SELECT * FROM experience')
        skills = await conn.fetch('SELECT * FROM skills')
        socials = await conn.fetch('SELECT * FROM socials')
        linkedin_posts = await conn.fetch('SELECT * FROM linkedin_posts')
        site_config = await conn.fetchrow('SELECT config_data FROM site_config LIMIT 1')
        
        return {
            "profile": dict(profile) if profile else None,
            "projects": [dict(r) for r in projects],
            "blog_posts": [dict(r) for r in blog_posts],
            "experience": [dict(r) for r in experience],
            "skills": [dict(r) for r in skills],
            "socials": [dict(r) for r in socials],
            "linkedin_posts": [dict(r) for r in linkedin_posts],
            "site_config": site_config['config_data'] if site_config else SITE_CONFIG,
            "exported_at": datetime.now(timezone.utc).isoformat()
        }

# ============ Seed Data ============

@app.post("/api/seed")
async def seed_data():
    """Seed the database with portfolio data"""
    p = await get_pool()
    async with p.acquire() as conn:
        # Check if already seeded
        existing = await conn.fetchrow('SELECT id FROM profile LIMIT 1')
        if existing:
            return {"message": "Database already seeded", "seeded": False}
        
        # Seed profile
        await conn.execute('''
            INSERT INTO profile (name, role, email, location, bio, years_experience, projects_shipped)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
        ''', "Mohamed Yazeed Faumy", "IT Manager / Technical Operations Lead", "2002yazeedfaumy@gmail.com",
            "Wattala, Sri Lanka", 
            "IT Manager / Technical Operations Lead with 5+ years of experience managing cloud infrastructure, VoIP systems, SaaS platforms, and high-availability environments.",
            5, 50)
        
        # Seed projects
        projects_data = [
            ("Cloud Infrastructure Management", "AWS and Linux VPS environments management ensuring high availability and system stability", 
             ["AWS", "Linux", "VPS", "Docker", "CI/CD"], "bg-blue-50", True, 1),
            ("Backend Monitoring Systems", "Built Python-based monitoring and alert systems to detect issues and automatically optimize performance",
             ["Python", "Prometheus", "Grafana", "APIs"], "bg-green-50", True, 2),
            ("VoIP & Telecom Solutions", "Managed and maintained VoIP systems for enterprise communication with 100% uptime",
             ["VoIP", "SIP", "Asterisk", "FreePBX"], "bg-purple-50", True, 3),
            ("SaaS Platform Development", "Led multiple SaaS and web application projects from planning to production release",
             ["React", "Node.js", "PostgreSQL", "Stripe"], "bg-orange-50", True, 4),
        ]
        for proj in projects_data:
            await conn.execute('''
                INSERT INTO projects (title, description, technologies, color, featured, sort_order)
                VALUES ($1, $2, $3, $4, $5, $6)
            ''', proj[0], proj[1], proj[2], proj[3], proj[4], proj[5])
        
        # Seed experience
        experience_data = [
            ("IT Project Coordinator / Technical Lead", "Port City BPO", "Sri Lanka", "January 2026 – Present",
             ["Led decision-making across IT infrastructure", "Managed AWS and Linux VPS environments", 
              "Built backend monitoring systems using Python", "Maintained near 100% uptime"], 1, True),
            ("Senior IT Manager / Project Lead", "Code Studio Global", "Sri Lanka", "May 2025 – January 2026",
             ["Led multiple SaaS and web application projects", "Defined project scope and deliverables",
              "Coordinated developers and stakeholders"], 2, False),
            ("IT Consultant / Project-Based Lead", "Freelance | Remote", "Remote", "January 2023 – January 2024",
             ["Delivered ERP, CRM, and automation projects", "Managed full project lifecycle"], 3, False),
            ("DevOps Engineer", "Sterling Carter Technology", "Kingston, Jamaica", "January 2021 – May 2023",
             ["Performed Log File Analysis for SEO optimization", "Coded Python scripts for data cleansing",
              "Developed CI/CD pipelines"], 4, False),
        ]
        for exp in experience_data:
            await conn.execute('''
                INSERT INTO experience (role, company, location, period, highlights, sort_order, is_current)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
            ''', exp[0], exp[1], exp[2], exp[3], exp[4], exp[5], exp[6])
        
        # Seed skills
        skills_data = [
            ("Team Leadership", "Management", 1), ("Project Management", "Management", 2),
            ("AWS", "Cloud & DevOps", 1), ("Linux VPS", "Cloud & DevOps", 2), ("Docker", "Cloud & DevOps", 3),
            ("Python", "Backend", 1), ("API Development", "Backend", 2), ("MySQL", "Backend", 3),
            ("VoIP Systems", "Platforms", 1), ("SaaS Platforms", "Platforms", 2),
        ]
        for skill in skills_data:
            await conn.execute('INSERT INTO skills (name, category, sort_order) VALUES ($1, $2, $3)', 
                             skill[0], skill[1], skill[2])
        
        # Seed socials
        socials_data = [
            ("Email", "Email", "2002yazeedfaumy@gmail.com", "mailto:2002yazeedfaumy@gmail.com", 1),
            ("LinkedIn", "LinkedIn", "linkedin.com/in/yazeedfaumy", "https://linkedin.com/in/yazeedfaumy", 2),
            ("GitHub", "GitHub", "github.com/yazeedfaumy", "https://github.com/yazeedfaumy", 3),
            ("Phone", "Phone", "+94 75 920 1455", "tel:+94759201455", 4),
        ]
        for social in socials_data:
            await conn.execute('''
                INSERT INTO socials (platform, label, value, href, sort_order) VALUES ($1, $2, $3, $4, $5)
            ''', social[0], social[1], social[2], social[3], social[4])
        
        # Seed blog posts
        blog_data = [
            ("Building High-Availability Cloud Infrastructure", 
             "Best practices for AWS and Linux VPS management in enterprise environments.",
             "<p>Managing cloud infrastructure requires careful planning and monitoring.</p>",
             ["Cloud", "AWS", "DevOps"], True),
            ("Automating IT Operations with Python",
             "How Python scripts can transform your IT monitoring and alert systems.",
             "<p>Automation is key to scaling IT operations.</p>",
             ["Python", "Automation", "IT"], True),
        ]
        for blog in blog_data:
            await conn.execute('''
                INSERT INTO blog_posts (title, excerpt, content, tags, published) VALUES ($1, $2, $3, $4, $5)
            ''', blog[0], blog[1], blog[2], blog[3], blog[4])
        
        # Seed LinkedIn posts
        linkedin_data = [
            ("Excited to share that we achieved 99.99% uptime across all our cloud infrastructure this quarter!", "2 days ago", 78, 15),
            ("Just wrapped up a successful SaaS platform launch with the team!", "1 week ago", 52, 12),
        ]
        for lp in linkedin_data:
            await conn.execute('''
                INSERT INTO linkedin_posts (content, post_date, likes, comments) VALUES ($1, $2, $3, $4)
            ''', lp[0], lp[1], lp[2], lp[3])
        
        # Seed site config
        await conn.execute('INSERT INTO site_config (config_data) VALUES ($1)', json.dumps(SITE_CONFIG))
        
        # Seed GitHub contributions
        await sync_github_contributions()
        
        return {"message": "Database seeded successfully", "seeded": True}

# ============ Clear and Reseed ============

@app.post("/api/clear-and-seed")
async def clear_and_seed():
    """Clear all data and reseed"""
    p = await get_pool()
    async with p.acquire() as conn:
        # Clear all tables
        await conn.execute('TRUNCATE profile, projects, blog_posts, experience, skills, socials, footer_links, linkedin_posts, github_contributions, about_blocks, project_sections, site_config, theme_settings RESTART IDENTITY CASCADE')
    
    # Reseed
    return await seed_data()

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat(), "database": "postgresql"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
