
-- Portfolio Data SQL Import Script
-- Generated: 2026-04-02T10:37:48.135932
-- This script can be used for PostgreSQL deployment

-- Clear existing data (optional)
-- TRUNCATE profile, projects, blog_posts, experience, skills, socials CASCADE;


-- ============ PROFILE ============
INSERT INTO profile (name, role, email, location, bio, years_experience, projects_shipped)
VALUES (
    'Mohamed Yazeed Faumy',
    'IT Manager / Technical Operations Lead',
    '2002yazeedfaumy@gmail.com',
    'Wattala, Sri Lanka',
    'IT Manager / Technical Operations Lead with 5+ years of experience managing cloud infrastructure, VoIP systems, SaaS platforms, and high-availability environments.',
    5,
    50
) ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    role = EXCLUDED.role,
    email = EXCLUDED.email,
    location = EXCLUDED.location,
    bio = EXCLUDED.bio;


-- ============ PROJECTS ============

INSERT INTO projects (title, description, technologies, color, featured, project_order)
VALUES (
    'Cloud Infrastructure Management',
    'AWS and Linux VPS environments management ensuring high availability and system stability for enterprise clients',
    '["AWS", "Linux", "VPS", "Docker", "CI/CD"]',
    'bg-blue-50',
    TRUE,
    1
);

INSERT INTO projects (title, description, technologies, color, featured, project_order)
VALUES (
    'Backend Monitoring Systems',
    'Built Python-based monitoring and alert systems to detect issues and automatically optimize system performance',
    '["Python", "Prometheus", "Grafana", "APIs"]',
    'bg-green-50',
    TRUE,
    2
);

INSERT INTO projects (title, description, technologies, color, featured, project_order)
VALUES (
    'VoIP & Telecom Solutions',
    'Managed and maintained VoIP systems for enterprise communication with 100% uptime during campaigns',
    '["VoIP", "SIP", "Asterisk", "FreePBX"]',
    'bg-purple-50',
    TRUE,
    3
);

INSERT INTO projects (title, description, technologies, color, featured, project_order)
VALUES (
    'SaaS Platform Development',
    'Led multiple SaaS and web application projects from planning to production release',
    '["React", "Node.js", "PostgreSQL", "Stripe"]',
    'bg-orange-50',
    TRUE,
    4
);

-- ============ EXPERIENCE ============

INSERT INTO experience (role, company, location, period, highlights, exp_order, is_current)
VALUES (
    'IT Project Coordinator / Technical Lead',
    'Port City BPO',
    'Sri Lanka',
    'January 2026 – Present',
    '["Led decision-making across IT infrastructure including servers, VoIP systems, applications, and software platforms", "Managed and maintained core systems on AWS and Linux VPS environments", "Built backend monitoring and alert systems using Python", "Designed and delivered custom internal and external applications"]',
    1,
    TRUE
);

INSERT INTO experience (role, company, location, period, highlights, exp_order, is_current)
VALUES (
    'Senior IT Manager / Project Lead',
    'Code Studio Global',
    'Sri Lanka',
    'May 2025 – January 2026',
    '["Led multiple SaaS and web application projects from planning to production release", "Defined project scope, timelines, milestones, and deliverables", "Coordinated developers, designers, and stakeholders"]',
    2,
    FALSE
);

INSERT INTO experience (role, company, location, period, highlights, exp_order, is_current)
VALUES (
    'IT Consultant / Project-Based Lead',
    'Freelance | Remote',
    'Remote',
    'January 2023 – January 2024',
    '["Delivered ERP, CRM, and automation projects for international clients", "Managed full project lifecycle including planning, execution, testing, and handover"]',
    3,
    FALSE
);

INSERT INTO experience (role, company, location, period, highlights, exp_order, is_current)
VALUES (
    'DevOps Engineer',
    'Sterling Carter Technology Distributors',
    'Kingston, Jamaica',
    'January 2021 – May 2023',
    '["Performed Log File Analysis to identify crawl budget inefficiencies", "Coded Python scripts for large-scale data cleansing and MySQL database optimization", "Developed and maintained automated CI/CD pipelines"]',
    4,
    FALSE
);

-- ============ SKILLS ============

INSERT INTO skills (name, category, skill_order)
VALUES ('Team Leadership', 'Management', 1);

INSERT INTO skills (name, category, skill_order)
VALUES ('Project Management', 'Management', 2);

INSERT INTO skills (name, category, skill_order)
VALUES ('AWS', 'Cloud & DevOps', 1);

INSERT INTO skills (name, category, skill_order)
VALUES ('Linux VPS', 'Cloud & DevOps', 2);

INSERT INTO skills (name, category, skill_order)
VALUES ('Docker', 'Cloud & DevOps', 3);

INSERT INTO skills (name, category, skill_order)
VALUES ('Python', 'Backend', 1);

INSERT INTO skills (name, category, skill_order)
VALUES ('API Development', 'Backend', 2);

INSERT INTO skills (name, category, skill_order)
VALUES ('MySQL', 'Backend', 3);

INSERT INTO skills (name, category, skill_order)
VALUES ('VoIP Systems', 'Platforms', 1);

INSERT INTO skills (name, category, skill_order)
VALUES ('SaaS Platforms', 'Platforms', 2);

-- ============ BLOG POSTS ============

INSERT INTO blog_posts (title, excerpt, content, tags, published)
VALUES (
    'Building High-Availability Cloud Infrastructure',
    'Best practices for AWS and Linux VPS management in enterprise environments.',
    '<p>Managing cloud infrastructure requires careful planning, monitoring, and optimization.</p>',
    '["Cloud", "AWS", "DevOps"]',
    TRUE
);

INSERT INTO blog_posts (title, excerpt, content, tags, published)
VALUES (
    'Automating IT Operations with Python',
    'How Python scripts can transform your IT monitoring and alert systems.',
    '<p>Automation is key to scaling IT operations.</p>',
    '["Python", "Automation", "IT"]',
    TRUE
);

-- ============ SOCIALS ============

INSERT INTO socials (platform, label, value, href, social_order)
VALUES ('Email', 'Email', '2002yazeedfaumy@gmail.com', 'mailto:2002yazeedfaumy@gmail.com', 1);

INSERT INTO socials (platform, label, value, href, social_order)
VALUES ('LinkedIn', 'LinkedIn', 'linkedin.com/in/yazeedfaumy', 'https://linkedin.com/in/yazeedfaumy', 2);

INSERT INTO socials (platform, label, value, href, social_order)
VALUES ('GitHub', 'GitHub', 'github.com/yazeedfaumy', 'https://github.com/yazeedfaumy', 3);

INSERT INTO socials (platform, label, value, href, social_order)
VALUES ('Phone', 'Phone', '+94 75 920 1455', 'tel:+94759201455', 4);
