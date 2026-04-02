#!/usr/bin/env python3
"""
Portfolio Data Export Script
Exports all MongoDB data to JSON files for easy deployment/migration

Usage:
    python export_data.py              # Export to JSON
    python export_data.py --sql        # Generate SQL-like import statements
    python export_data.py --import     # Import from exported JSON
"""

import os
import json
import asyncio
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId

# MongoDB connection
MONGO_URL = os.environ.get("MONGO_URL", "mongodb://localhost:27017")
DB_NAME = os.environ.get("DB_NAME", "portfolio")

class JSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        if isinstance(obj, datetime):
            return obj.isoformat()
        return super().default(obj)

async def export_data():
    """Export all data from MongoDB to JSON"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    collections = [
        "profile", "projects", "blog_posts", "experience", "skills",
        "socials", "footer_links", "linkedin_posts", "about_blocks",
        "project_sections", "site_config", "github_contributions", "theme_settings"
    ]
    
    export_data = {
        "metadata": {
            "exported_at": datetime.utcnow().isoformat(),
            "database": DB_NAME,
            "version": "1.0"
        },
        "collections": {}
    }
    
    for collection_name in collections:
        docs = await db[collection_name].find().to_list(1000)
        # Convert ObjectId to string
        for doc in docs:
            if "_id" in doc:
                doc["_id"] = str(doc["_id"])
        export_data["collections"][collection_name] = docs
        print(f"Exported {len(docs)} documents from {collection_name}")
    
    # Save to file
    output_file = "/app/portfolio_data_export.json"
    with open(output_file, "w") as f:
        json.dump(export_data, f, indent=2, cls=JSONEncoder)
    
    print(f"\n✅ Data exported to {output_file}")
    
    client.close()
    return export_data

async def import_data(filepath="/app/portfolio_data_export.json"):
    """Import data from JSON file to MongoDB"""
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    
    with open(filepath, "r") as f:
        data = json.load(f)
    
    for collection_name, docs in data.get("collections", {}).items():
        if docs:
            # Clear existing data
            await db[collection_name].delete_many({})
            
            # Remove _id to let MongoDB generate new ones
            for doc in docs:
                if "_id" in doc:
                    del doc["_id"]
            
            # Insert documents
            await db[collection_name].insert_many(docs)
            print(f"Imported {len(docs)} documents to {collection_name}")
    
    print("\n✅ Data imported successfully")
    client.close()

def generate_sql_statements(data):
    """Generate SQL-like statements for PostgreSQL migration"""
    
    sql_output = """
-- Portfolio Data SQL Import Script
-- Generated: {timestamp}
-- This script can be used for PostgreSQL deployment

-- Clear existing data (optional)
-- TRUNCATE profile, projects, blog_posts, experience, skills, socials CASCADE;

""".format(timestamp=datetime.utcnow().isoformat())

    collections = data.get("collections", {})
    
    # Profile
    if collections.get("profile"):
        profile = collections["profile"][0] if collections["profile"] else {}
        sql_output += """
-- ============ PROFILE ============
INSERT INTO profile (name, role, email, location, bio, years_experience, projects_shipped)
VALUES (
    '{name}',
    '{role}',
    '{email}',
    '{location}',
    '{bio}',
    {years_exp},
    {projects}
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    email = EXCLUDED.email,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio;

""".format(
            name=profile.get("name", "").replace("'", "''"),
            role=profile.get("role", "").replace("'", "''"),
            email=profile.get("email", "").replace("'", "''"),
            location=profile.get("location", "").replace("'", "''"),
            bio=profile.get("bio", "").replace("'", "''"),
            years_exp=profile.get("yearsExperience", 0),
            projects=profile.get("projectsShipped", 0)
        )
    
    # Projects
    sql_output += "\n-- ============ PROJECTS ============\n"
    for proj in collections.get("projects", []):
        technologies = json.dumps(proj.get("technologies", []))
        sql_output += """
INSERT INTO projects (title, description, technologies, color, featured, project_order)
VALUES (
    '{title}',
    '{description}',
    '{technologies}',
    '{color}',
    {featured},
    {order}
);
""".format(
            title=proj.get("title", "").replace("'", "''"),
            description=proj.get("description", "").replace("'", "''"),
            technologies=technologies.replace("'", "''"),
            color=proj.get("color", "bg-gray-50"),
            featured="TRUE" if proj.get("featured") else "FALSE",
            order=proj.get("order", 0)
        )
    
    # Experience
    sql_output += "\n-- ============ EXPERIENCE ============\n"
    for exp in collections.get("experience", []):
        highlights = json.dumps(exp.get("highlights", []))
        sql_output += """
INSERT INTO experience (role, company, location, period, highlights, exp_order, is_current)
VALUES (
    '{role}',
    '{company}',
    '{location}',
    '{period}',
    '{highlights}',
    {order},
    {current}
);
""".format(
            role=exp.get("role", "").replace("'", "''"),
            company=exp.get("company", "").replace("'", "''"),
            location=exp.get("location", "").replace("'", "''"),
            period=exp.get("period", "").replace("'", "''"),
            highlights=highlights.replace("'", "''"),
            order=exp.get("order", 0),
            current="TRUE" if exp.get("current") else "FALSE"
        )
    
    # Skills
    sql_output += "\n-- ============ SKILLS ============\n"
    for skill in collections.get("skills", []):
        sql_output += """
INSERT INTO skills (name, category, skill_order)
VALUES ('{name}', '{category}', {order});
""".format(
            name=skill.get("name", "").replace("'", "''"),
            category=skill.get("category", "").replace("'", "''"),
            order=skill.get("order", 0)
        )
    
    # Blog Posts
    sql_output += "\n-- ============ BLOG POSTS ============\n"
    for post in collections.get("blog_posts", []):
        tags = json.dumps(post.get("tags", []))
        sql_output += """
INSERT INTO blog_posts (title, excerpt, content, tags, published)
VALUES (
    '{title}',
    '{excerpt}',
    '{content}',
    '{tags}',
    {published}
);
""".format(
            title=post.get("title", "").replace("'", "''"),
            excerpt=post.get("excerpt", "").replace("'", "''"),
            content=post.get("content", "").replace("'", "''"),
            tags=tags.replace("'", "''"),
            published="TRUE" if post.get("published") else "FALSE"
        )
    
    # Socials
    sql_output += "\n-- ============ SOCIALS ============\n"
    for social in collections.get("socials", []):
        sql_output += """
INSERT INTO socials (platform, label, value, href, social_order)
VALUES ('{platform}', '{label}', '{value}', '{href}', {order});
""".format(
            platform=social.get("platform", "").replace("'", "''"),
            label=social.get("label", "").replace("'", "''"),
            value=social.get("value", "").replace("'", "''"),
            href=social.get("href", "").replace("'", "''"),
            order=social.get("order", 0)
        )
    
    return sql_output

async def main():
    import sys
    
    if "--import" in sys.argv:
        filepath = sys.argv[sys.argv.index("--import") + 1] if len(sys.argv) > sys.argv.index("--import") + 1 else "/app/portfolio_data_export.json"
        await import_data(filepath)
    else:
        data = await export_data()
        
        if "--sql" in sys.argv:
            sql = generate_sql_statements(data)
            sql_file = "/app/portfolio_data_import.sql"
            with open(sql_file, "w") as f:
                f.write(sql)
            print(f"✅ SQL statements saved to {sql_file}")

if __name__ == "__main__":
    asyncio.run(main())
