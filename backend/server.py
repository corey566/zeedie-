from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from bson import ObjectId
import os
import json
import httpx
from motor.motor_asyncio import AsyncIOMotorClient
import secrets

app = FastAPI(title="Portfolio API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "portfolio")
client = AsyncIOMotorClient(MONGO_URL)
db = client[DB_NAME]

# Helper to convert ObjectId to string
def serialize_doc(doc):
    if doc is None:
        return None
    if "_id" in doc:
        doc["id"] = str(doc["_id"])
        del doc["_id"]
    return doc

def serialize_docs(docs):
    return [serialize_doc(doc) for doc in docs]

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

class Skill(BaseModel):
    name: str
    category: str
    order: int = 0

class Social(BaseModel):
    platform: str
    label: str
    value: str
    href: str
    order: int = 0

class FooterLink(BaseModel):
    label: str
    href: str
    order: int = 0

class LinkedinPost(BaseModel):
    content: str
    date: str
    likes: int = 0
    comments: int = 0

class GithubContribution(BaseModel):
    date: str
    count: int = 0
    level: int = 0

class AboutBlock(BaseModel):
    title: str
    content: str
    style: str = "light"
    imageUrl: Optional[str] = None
    imagePosition: Optional[str] = None
    order: int = 0

class ProjectSection(BaseModel):
    projectId: str
    title: Optional[str] = None
    content: str
    imageUrl: Optional[str] = None
    imageAlignment: Optional[str] = None
    imageCaption: Optional[str] = None
    order: int = 0

class AdminLogin(BaseModel):
    username: str
    password: str

# Site config storage
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
async def admin_login(data: AdminLogin):
    if data.username == ADMIN_USERNAME and data.password == ADMIN_PASSWORD:
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
    profile = await db.profile.find_one()
    if profile:
        return serialize_doc(profile)
    # Return default if not found
    return {
        "id": "default",
        "name": "Mohamed Yazeed Faumy",
        "role": "IT Manager / Technical Operations Lead",
        "email": "2002yazeedfaumy@gmail.com",
        "location": "Wattala, Sri Lanka",
        "bio": "IT Manager / Technical Operations Lead with 5+ years of experience managing cloud infrastructure, VoIP systems, SaaS platforms, and high-availability environments.",
        "yearsExperience": 5,
        "projectsShipped": 50
    }

@app.put("/api/profile")
async def update_profile(data: Profile):
    existing = await db.profile.find_one()
    profile_dict = data.model_dump()
    profile_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()
    
    if existing:
        await db.profile.update_one({"_id": existing["_id"]}, {"$set": profile_dict})
        return serialize_doc({**existing, **profile_dict})
    else:
        result = await db.profile.insert_one(profile_dict)
        profile_dict["id"] = str(result.inserted_id)
        return profile_dict

# ============ Projects ============

@app.get("/api/projects")
async def get_projects():
    projects = await db.projects.find().sort([("order", 1), ("createdAt", -1)]).to_list(100)
    return serialize_docs(projects)

@app.get("/api/projects/featured")
async def get_featured_projects():
    projects = await db.projects.find({"featured": True}).sort("order", 1).to_list(100)
    return serialize_docs(projects)

@app.get("/api/projects/{project_id}")
async def get_project(project_id: str):
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
    except:
        project = await db.projects.find_one({"id": project_id})
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return serialize_doc(project)

@app.post("/api/projects")
async def create_project(data: Project):
    project_dict = data.model_dump()
    project_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.projects.insert_one(project_dict)
    project_dict["id"] = str(result.inserted_id)
    return project_dict

@app.put("/api/projects/{project_id}")
async def update_project(project_id: str, data: dict):
    try:
        result = await db.projects.update_one(
            {"_id": ObjectId(project_id)},
            {"$set": data}
        )
    except:
        result = await db.projects.update_one(
            {"id": project_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True}

@app.delete("/api/projects/{project_id}")
async def delete_project(project_id: str):
    try:
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
    except:
        result = await db.projects.delete_one({"id": project_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Project not found")
    return {"success": True}

# ============ Blog Posts ============

@app.get("/api/blog")
async def get_published_blog_posts():
    posts = await db.blog_posts.find({"published": True}).sort("publishedDate", -1).to_list(100)
    return serialize_docs(posts)

@app.get("/api/blog/all")
async def get_all_blog_posts():
    posts = await db.blog_posts.find().sort("publishedDate", -1).to_list(100)
    return serialize_docs(posts)

@app.get("/api/blog/{post_id}")
async def get_blog_post(post_id: str):
    try:
        post = await db.blog_posts.find_one({"_id": ObjectId(post_id)})
    except:
        post = await db.blog_posts.find_one({"id": post_id})
    if not post:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return serialize_doc(post)

@app.post("/api/blog")
async def create_blog_post(data: BlogPost):
    post_dict = data.model_dump()
    post_dict["publishedDate"] = datetime.now(timezone.utc).isoformat()
    post_dict["updatedAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.blog_posts.insert_one(post_dict)
    post_dict["id"] = str(result.inserted_id)
    return post_dict

@app.put("/api/blog/{post_id}")
async def update_blog_post(post_id: str, data: dict):
    data["updatedAt"] = datetime.now(timezone.utc).isoformat()
    try:
        result = await db.blog_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": data}
        )
    except:
        result = await db.blog_posts.update_one(
            {"id": post_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}

@app.delete("/api/blog/{post_id}")
async def delete_blog_post(post_id: str):
    try:
        result = await db.blog_posts.delete_one({"_id": ObjectId(post_id)})
    except:
        result = await db.blog_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Blog post not found")
    return {"success": True}

# ============ Experience ============

@app.get("/api/experience")
async def get_experience():
    experience = await db.experience.find().sort([("order", 1), ("createdAt", -1)]).to_list(100)
    return serialize_docs(experience)

@app.post("/api/experience")
async def create_experience(data: Experience):
    exp_dict = data.model_dump()
    exp_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.experience.insert_one(exp_dict)
    exp_dict["id"] = str(result.inserted_id)
    return exp_dict

@app.put("/api/experience/{exp_id}")
async def update_experience(exp_id: str, data: dict):
    try:
        result = await db.experience.update_one(
            {"_id": ObjectId(exp_id)},
            {"$set": data}
        )
    except:
        result = await db.experience.update_one(
            {"id": exp_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"success": True}

@app.delete("/api/experience/{exp_id}")
async def delete_experience(exp_id: str):
    try:
        result = await db.experience.delete_one({"_id": ObjectId(exp_id)})
    except:
        result = await db.experience.delete_one({"id": exp_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Experience not found")
    return {"success": True}

# ============ Skills ============

@app.get("/api/skills")
async def get_skills():
    skills = await db.skills.find().sort([("category", 1), ("order", 1)]).to_list(100)
    return serialize_docs(skills)

@app.post("/api/skills")
async def create_skill(data: Skill):
    skill_dict = data.model_dump()
    result = await db.skills.insert_one(skill_dict)
    skill_dict["id"] = str(result.inserted_id)
    return skill_dict

@app.put("/api/skills/{skill_id}")
async def update_skill(skill_id: str, data: dict):
    try:
        result = await db.skills.update_one(
            {"_id": ObjectId(skill_id)},
            {"$set": data}
        )
    except:
        result = await db.skills.update_one(
            {"id": skill_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"success": True}

@app.delete("/api/skills/{skill_id}")
async def delete_skill(skill_id: str):
    try:
        result = await db.skills.delete_one({"_id": ObjectId(skill_id)})
    except:
        result = await db.skills.delete_one({"id": skill_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"success": True}

# ============ Socials ============

@app.get("/api/socials")
async def get_socials():
    socials = await db.socials.find().sort("order", 1).to_list(100)
    return serialize_docs(socials)

@app.post("/api/socials")
async def create_social(data: Social):
    social_dict = data.model_dump()
    result = await db.socials.insert_one(social_dict)
    social_dict["id"] = str(result.inserted_id)
    return social_dict

@app.put("/api/socials/{social_id}")
async def update_social(social_id: str, data: dict):
    try:
        result = await db.socials.update_one(
            {"_id": ObjectId(social_id)},
            {"$set": data}
        )
    except:
        result = await db.socials.update_one(
            {"id": social_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Social not found")
    return {"success": True}

@app.delete("/api/socials/{social_id}")
async def delete_social(social_id: str):
    try:
        result = await db.socials.delete_one({"_id": ObjectId(social_id)})
    except:
        result = await db.socials.delete_one({"id": social_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Social not found")
    return {"success": True}

# ============ Footer Links ============

@app.get("/api/footer-links")
async def get_footer_links():
    links = await db.footer_links.find().sort("order", 1).to_list(100)
    return serialize_docs(links)

@app.post("/api/footer-links")
async def create_footer_link(data: FooterLink):
    link_dict = data.model_dump()
    result = await db.footer_links.insert_one(link_dict)
    link_dict["id"] = str(result.inserted_id)
    return link_dict

@app.delete("/api/footer-links/{link_id}")
async def delete_footer_link(link_id: str):
    try:
        result = await db.footer_links.delete_one({"_id": ObjectId(link_id)})
    except:
        result = await db.footer_links.delete_one({"id": link_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Footer link not found")
    return {"success": True}

# ============ LinkedIn Posts ============

@app.get("/api/linkedin-posts")
async def get_linkedin_posts():
    posts = await db.linkedin_posts.find().sort("createdAt", -1).to_list(10)
    return serialize_docs(posts)

@app.post("/api/linkedin-posts")
async def create_linkedin_post(data: LinkedinPost):
    post_dict = data.model_dump()
    post_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.linkedin_posts.insert_one(post_dict)
    post_dict["id"] = str(result.inserted_id)
    return post_dict

@app.put("/api/linkedin-posts/{post_id}")
async def update_linkedin_post(post_id: str, data: dict):
    try:
        result = await db.linkedin_posts.update_one(
            {"_id": ObjectId(post_id)},
            {"$set": data}
        )
    except:
        result = await db.linkedin_posts.update_one(
            {"id": post_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="LinkedIn post not found")
    return {"success": True}

@app.delete("/api/linkedin-posts/{post_id}")
async def delete_linkedin_post(post_id: str):
    try:
        result = await db.linkedin_posts.delete_one({"_id": ObjectId(post_id)})
    except:
        result = await db.linkedin_posts.delete_one({"id": post_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="LinkedIn post not found")
    return {"success": True}

# ============ GitHub Contributions ============

@app.get("/api/github-contributions")
async def get_github_contributions():
    contributions = await db.github_contributions.find().sort("date", 1).to_list(365)
    return serialize_docs(contributions)

@app.post("/api/github-sync")
async def sync_github_contributions():
    # Generate mock contributions for the last 180 days
    import random
    contributions = []
    today = datetime.now(timezone.utc)
    
    # Clear existing
    await db.github_contributions.delete_many({})
    
    for i in range(180):
        date = today.replace(hour=0, minute=0, second=0, microsecond=0)
        date = date.replace(day=today.day - (179 - i)) if today.day > (179 - i) else date
        
        from datetime import timedelta
        date = today - timedelta(days=(179 - i))
        
        count = random.randint(0, 8) if random.random() > 0.3 else 0
        level = min(count // 2 + 1, 4) if count > 0 else 0
        
        contributions.append({
            "date": date.strftime("%Y-%m-%d"),
            "count": count,
            "level": level
        })
    
    if contributions:
        await db.github_contributions.insert_many(contributions)
    
    return {"success": True, "count": len(contributions)}

# ============ About Blocks ============

@app.get("/api/about-blocks")
async def get_about_blocks():
    blocks = await db.about_blocks.find().sort("order", 1).to_list(100)
    return serialize_docs(blocks)

@app.post("/api/about-blocks")
async def create_about_block(data: AboutBlock):
    block_dict = data.model_dump()
    block_dict["createdAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.about_blocks.insert_one(block_dict)
    block_dict["id"] = str(result.inserted_id)
    return block_dict

@app.put("/api/about-blocks/{block_id}")
async def update_about_block(block_id: str, data: dict):
    try:
        result = await db.about_blocks.update_one(
            {"_id": ObjectId(block_id)},
            {"$set": data}
        )
    except:
        result = await db.about_blocks.update_one(
            {"id": block_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="About block not found")
    return {"success": True}

@app.delete("/api/about-blocks/{block_id}")
async def delete_about_block(block_id: str):
    try:
        result = await db.about_blocks.delete_one({"_id": ObjectId(block_id)})
    except:
        result = await db.about_blocks.delete_one({"id": block_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="About block not found")
    return {"success": True}

# ============ Project Sections ============

@app.get("/api/projects/{project_id}/sections")
async def get_project_sections(project_id: str):
    sections = await db.project_sections.find({"projectId": project_id}).sort("order", 1).to_list(100)
    return serialize_docs(sections)

@app.post("/api/projects/{project_id}/sections")
async def create_project_section(project_id: str, data: dict):
    data["projectId"] = project_id
    data["createdAt"] = datetime.now(timezone.utc).isoformat()
    result = await db.project_sections.insert_one(data)
    data["id"] = str(result.inserted_id)
    return data

@app.put("/api/project-sections/{section_id}")
async def update_project_section(section_id: str, data: dict):
    try:
        result = await db.project_sections.update_one(
            {"_id": ObjectId(section_id)},
            {"$set": data}
        )
    except:
        result = await db.project_sections.update_one(
            {"id": section_id},
            {"$set": data}
        )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"success": True}

@app.delete("/api/project-sections/{section_id}")
async def delete_project_section(section_id: str):
    try:
        result = await db.project_sections.delete_one({"_id": ObjectId(section_id)})
    except:
        result = await db.project_sections.delete_one({"id": section_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Section not found")
    return {"success": True}

# ============ Site Config ============

@app.get("/api/site-config")
async def get_site_config():
    config = await db.site_config.find_one()
    if config:
        return serialize_doc(config)
    return SITE_CONFIG

@app.put("/api/site-config")
async def update_site_config(data: dict):
    existing = await db.site_config.find_one()
    if existing:
        await db.site_config.update_one({"_id": existing["_id"]}, {"$set": data})
    else:
        await db.site_config.insert_one(data)
    return {"success": True, "config": data}

# ============ Real GitHub Integration ============

GITHUB_USERNAME = os.environ.get("GITHUB_USERNAME", "yazeedfaumy")

@app.post("/api/github-sync-real")
async def sync_real_github_contributions(username: str = None):
    """Fetch real GitHub contributions using the GitHub GraphQL API"""
    github_user = username or GITHUB_USERNAME
    github_token = os.environ.get("GITHUB_TOKEN")
    
    if github_token:
        # Use GraphQL API for real data
        query = """
        query($userName: String!) {
          user(login: $userName) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
        """
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    "https://api.github.com/graphql",
                    json={"query": query, "variables": {"userName": github_user}},
                    headers={
                        "Authorization": f"Bearer {github_token}",
                        "Content-Type": "application/json"
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    data = response.json()
                    if "data" in data and data["data"]["user"]:
                        calendar = data["data"]["user"]["contributionsCollection"]["contributionCalendar"]
                        
                        # Clear existing
                        await db.github_contributions.delete_many({})
                        
                        contributions = []
                        for week in calendar["weeks"]:
                            for day in week["contributionDays"]:
                                count = day["contributionCount"]
                                level = 0 if count == 0 else min(count // 3 + 1, 4)
                                contributions.append({
                                    "date": day["date"],
                                    "count": count,
                                    "level": level
                                })
                        
                        if contributions:
                            await db.github_contributions.insert_many(contributions)
                        
                        return {
                            "success": True, 
                            "count": len(contributions),
                            "total": calendar["totalContributions"],
                            "source": "github_api"
                        }
        except Exception as e:
            print(f"GitHub API error: {e}")
    
    # Fallback to mock data
    return await sync_github_contributions()

@app.get("/api/github-repos")
async def get_github_repos(username: str = None):
    """Fetch public repositories from GitHub"""
    github_user = username or GITHUB_USERNAME
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.github.com/users/{github_user}/repos",
                params={"sort": "updated", "per_page": 10},
                headers={"Accept": "application/vnd.github.v3+json"},
                timeout=30.0
            )
            
            if response.status_code == 200:
                repos = response.json()
                return [{
                    "name": repo["name"],
                    "description": repo["description"],
                    "url": repo["html_url"],
                    "stars": repo["stargazers_count"],
                    "forks": repo["forks_count"],
                    "language": repo["language"],
                    "updated": repo["updated_at"]
                } for repo in repos if not repo["fork"]]
    except Exception as e:
        print(f"GitHub repos error: {e}")
    
    return []

# ============ Theme Settings ============

@app.get("/api/theme")
async def get_theme():
    theme = await db.theme_settings.find_one()
    if theme:
        return serialize_doc(theme)
    return {"mode": "light", "id": "default"}

@app.put("/api/theme")
async def update_theme(data: dict):
    existing = await db.theme_settings.find_one()
    # Remove any ObjectId from data to avoid serialization issues
    if "id" in data:
        del data["id"]
    if "_id" in data:
        del data["_id"]
    
    if existing:
        await db.theme_settings.update_one({"_id": existing["_id"]}, {"$set": data})
    else:
        await db.theme_settings.insert_one(data)
    return {"success": True, "theme": data}

# ============ Resume/CV Download ============

@app.get("/api/resume/generate")
async def generate_resume():
    """Generate resume data for PDF creation"""
    profile = await db.profile.find_one()
    experience = await db.experience.find().sort("order", 1).to_list(10)
    skills = await db.skills.find().sort([("category", 1), ("order", 1)]).to_list(50)
    projects = await db.projects.find({"featured": True}).sort("order", 1).to_list(10)
    socials = await db.socials.find().sort("order", 1).to_list(10)
    
    # Group skills by category
    skills_by_category = {}
    for skill in skills:
        cat = skill.get("category", "Other")
        if cat not in skills_by_category:
            skills_by_category[cat] = []
        skills_by_category[cat].append(skill.get("name", ""))
    
    resume_data = {
        "profile": serialize_doc(profile) if profile else {},
        "experience": serialize_docs(experience),
        "skills": skills_by_category,
        "projects": serialize_docs(projects),
        "socials": serialize_docs(socials),
        "generatedAt": datetime.now(timezone.utc).isoformat()
    }
    
    return resume_data

# ============ Data Export/Import ============

@app.get("/api/export")
async def export_all_data():
    """Export all portfolio data for backup/migration"""
    data = {
        "profile": serialize_doc(await db.profile.find_one()),
        "projects": serialize_docs(await db.projects.find().to_list(100)),
        "blog_posts": serialize_docs(await db.blog_posts.find().to_list(100)),
        "experience": serialize_docs(await db.experience.find().to_list(100)),
        "skills": serialize_docs(await db.skills.find().to_list(100)),
        "socials": serialize_docs(await db.socials.find().to_list(100)),
        "footer_links": serialize_docs(await db.footer_links.find().to_list(100)),
        "linkedin_posts": serialize_docs(await db.linkedin_posts.find().to_list(100)),
        "about_blocks": serialize_docs(await db.about_blocks.find().to_list(100)),
        "project_sections": serialize_docs(await db.project_sections.find().to_list(100)),
        "site_config": serialize_doc(await db.site_config.find_one()),
        "theme_settings": serialize_doc(await db.theme_settings.find_one()),
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "version": "1.0"
    }
    return data

@app.post("/api/import")
async def import_all_data(data: dict):
    """Import portfolio data from backup"""
    try:
        # Clear existing data
        collections = ["profile", "projects", "blog_posts", "experience", "skills", 
                      "socials", "footer_links", "linkedin_posts", "about_blocks", 
                      "project_sections", "site_config", "theme_settings"]
        
        for collection in collections:
            await db[collection].delete_many({})
        
        # Import data
        if data.get("profile"):
            profile = data["profile"]
            if "id" in profile:
                del profile["id"]
            await db.profile.insert_one(profile)
        
        for collection in ["projects", "blog_posts", "experience", "skills", 
                          "socials", "footer_links", "linkedin_posts", "about_blocks", 
                          "project_sections"]:
            items = data.get(collection, [])
            if items:
                for item in items:
                    if "id" in item:
                        del item["id"]
                await db[collection].insert_many(items)
        
        if data.get("site_config"):
            config = data["site_config"]
            if "id" in config:
                del config["id"]
            await db.site_config.insert_one(config)
        
        if data.get("theme_settings"):
            theme = data["theme_settings"]
            if "id" in theme:
                del theme["id"]
            await db.theme_settings.insert_one(theme)
        
        return {"success": True, "message": "Data imported successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Import failed: {str(e)}")

# ============ Seed Data ============

@app.post("/api/seed")
async def seed_data():
    """Seed the database with initial portfolio data"""
    
    # Check if already seeded
    existing_profile = await db.profile.find_one()
    if existing_profile:
        return {"message": "Database already seeded", "seeded": False}
    
    # Seed profile
    profile_data = {
        "name": "Mohamed Yazeed Faumy",
        "role": "IT Manager / Technical Operations Lead",
        "email": "2002yazeedfaumy@gmail.com",
        "location": "Wattala, Sri Lanka",
        "bio": "IT Manager / Technical Operations Lead with 5+ years of experience managing cloud infrastructure, VoIP systems, SaaS platforms, and high-availability environments.",
        "yearsExperience": 5,
        "projectsShipped": 50
    }
    await db.profile.insert_one(profile_data)
    
    # Seed projects
    projects = [
        {
            "title": "Cloud Infrastructure Management",
            "description": "AWS and Linux VPS environments management ensuring high availability and system stability for enterprise clients",
            "technologies": ["AWS", "Linux", "VPS", "Docker", "CI/CD"],
            "color": "bg-blue-50",
            "featured": True,
            "order": 1,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "title": "Backend Monitoring Systems",
            "description": "Built Python-based monitoring and alert systems to detect issues and automatically optimize system performance",
            "technologies": ["Python", "Prometheus", "Grafana", "APIs"],
            "color": "bg-green-50",
            "featured": True,
            "order": 2,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "title": "VoIP & Telecom Solutions",
            "description": "Managed and maintained VoIP systems for enterprise communication with 100% uptime during campaigns",
            "technologies": ["VoIP", "SIP", "Asterisk", "FreePBX"],
            "color": "bg-purple-50",
            "featured": True,
            "order": 3,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "title": "SaaS Platform Development",
            "description": "Led multiple SaaS and web application projects from planning to production release",
            "technologies": ["React", "Node.js", "PostgreSQL", "Stripe"],
            "color": "bg-orange-50",
            "featured": True,
            "order": 4,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.projects.insert_many(projects)
    
    # Seed experience
    experience = [
        {
            "role": "IT Project Coordinator / Technical Lead",
            "company": "Port City BPO",
            "location": "Sri Lanka",
            "period": "January 2026 – Present",
            "highlights": [
                "Led decision-making across IT infrastructure including servers, VoIP systems, applications, and software platforms",
                "Managed and maintained core systems on AWS and Linux VPS environments",
                "Built backend monitoring and alert systems using Python",
                "Designed and delivered custom internal and external applications"
            ],
            "order": 1,
            "current": True,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "role": "Senior IT Manager / Project Lead",
            "company": "Code Studio Global",
            "location": "Sri Lanka",
            "period": "May 2025 – January 2026",
            "highlights": [
                "Led multiple SaaS and web application projects from planning to production release",
                "Defined project scope, timelines, milestones, and deliverables",
                "Coordinated developers, designers, and stakeholders"
            ],
            "order": 2,
            "current": False,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "role": "IT Consultant / Project-Based Lead",
            "company": "Freelance | Remote",
            "location": "Remote",
            "period": "January 2023 – January 2024",
            "highlights": [
                "Delivered ERP, CRM, and automation projects for international clients",
                "Managed full project lifecycle including planning, execution, testing, and handover"
            ],
            "order": 3,
            "current": False,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "role": "DevOps Engineer",
            "company": "Sterling Carter Technology Distributors",
            "location": "Kingston, Jamaica",
            "period": "January 2021 – May 2023",
            "highlights": [
                "Performed Log File Analysis to identify crawl budget inefficiencies",
                "Coded Python scripts for large-scale data cleansing and MySQL database optimization",
                "Developed and maintained automated CI/CD pipelines"
            ],
            "order": 4,
            "current": False,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.experience.insert_many(experience)
    
    # Seed skills
    skills = [
        {"name": "Team Leadership", "category": "Management", "order": 1},
        {"name": "Project Management", "category": "Management", "order": 2},
        {"name": "AWS", "category": "Cloud & DevOps", "order": 1},
        {"name": "Linux VPS", "category": "Cloud & DevOps", "order": 2},
        {"name": "Docker", "category": "Cloud & DevOps", "order": 3},
        {"name": "Python", "category": "Backend", "order": 1},
        {"name": "API Development", "category": "Backend", "order": 2},
        {"name": "MySQL", "category": "Backend", "order": 3},
        {"name": "VoIP Systems", "category": "Platforms", "order": 1},
        {"name": "SaaS Platforms", "category": "Platforms", "order": 2},
    ]
    await db.skills.insert_many(skills)
    
    # Seed socials
    socials = [
        {"platform": "Email", "label": "Email", "value": "2002yazeedfaumy@gmail.com", "href": "mailto:2002yazeedfaumy@gmail.com", "order": 1},
        {"platform": "LinkedIn", "label": "LinkedIn", "value": "linkedin.com/in/yazeedfaumy", "href": "https://linkedin.com/in/yazeedfaumy", "order": 2},
        {"platform": "GitHub", "label": "GitHub", "value": "github.com/yazeedfaumy", "href": "https://github.com/yazeedfaumy", "order": 3},
        {"platform": "Phone", "label": "Phone", "value": "+94 75 920 1455", "href": "tel:+94759201455", "order": 4},
    ]
    await db.socials.insert_many(socials)
    
    # Seed blog posts
    blog_posts = [
        {
            "title": "Building High-Availability Cloud Infrastructure",
            "excerpt": "Best practices for AWS and Linux VPS management in enterprise environments.",
            "content": "<p>Managing cloud infrastructure requires careful planning, monitoring, and optimization.</p>",
            "tags": ["Cloud", "AWS", "DevOps"],
            "published": True,
            "publishedDate": datetime.now(timezone.utc).isoformat()
        },
        {
            "title": "Automating IT Operations with Python",
            "excerpt": "How Python scripts can transform your IT monitoring and alert systems.",
            "content": "<p>Automation is key to scaling IT operations.</p>",
            "tags": ["Python", "Automation", "IT"],
            "published": True,
            "publishedDate": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.blog_posts.insert_many(blog_posts)
    
    # Seed LinkedIn posts
    linkedin_posts = [
        {
            "content": "Excited to share that we achieved 99.99% uptime across all our cloud infrastructure this quarter!",
            "date": "2 days ago",
            "likes": 78,
            "comments": 15,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
        {
            "content": "Just wrapped up a successful SaaS platform launch with the team at Code Studio Global.",
            "date": "1 week ago",
            "likes": 52,
            "comments": 12,
            "createdAt": datetime.now(timezone.utc).isoformat()
        },
    ]
    await db.linkedin_posts.insert_many(linkedin_posts)
    
    # Seed GitHub contributions
    await sync_github_contributions()
    
    # Seed site config
    await db.site_config.insert_one(SITE_CONFIG)
    
    return {"message": "Database seeded successfully", "seeded": True}

# Health check
@app.get("/api/health")
async def health():
    return {"status": "ok", "timestamp": datetime.now(timezone.utc).isoformat()}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)
