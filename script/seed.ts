import { db } from "@db";
import { 
  profile, 
  projects, 
  blogPosts, 
  experience, 
  skills, 
  socials, 
  footerLinks,
  linkedinPosts,
  githubContributions
} from "@shared/schema";

async function seed() {
  console.log("Seeding database with Mohamed Yazeed Faumy's portfolio data...");

  // Seed profile with actual resume data
  await db.insert(profile).values({
    name: "Mohamed Yazeed Faumy",
    role: "IT Manager / Technical Operations Lead",
    email: "2002yazeedfaumy@gmail.com",
    location: "Wattala, Sri Lanka",
    bio: "IT Manager / Technical Operations Lead with 5+ years of experience managing cloud infrastructure, VoIP systems, SaaS platforms, and high-availability environments. Proven ability to lead cross-functional teams, manage IT and resource budgets, and make strategic decisions across servers, applications, telecom, and software ecosystems.",
    profileImage: "/assets/stock_images/professional_develop_ccee3624.jpg",
    yearsExperience: 5,
    projectsShipped: 50,
  }).onConflictDoNothing();

  // Seed projects based on work experience
  await db.insert(projects).values([
    {
      title: "Cloud Infrastructure Management",
      description: "AWS and Linux VPS environments management ensuring high availability and system stability for enterprise clients",
      technologies: ["AWS", "Linux", "VPS", "Docker", "CI/CD"],
      color: "bg-blue-50",
      featured: true,
      order: 1,
    },
    {
      title: "Backend Monitoring Systems",
      description: "Built Python-based monitoring and alert systems to detect issues and automatically optimize system performance",
      technologies: ["Python", "Prometheus", "Grafana", "APIs"],
      color: "bg-green-50",
      featured: true,
      order: 2,
    },
    {
      title: "VoIP & Telecom Solutions",
      description: "Managed and maintained VoIP systems for enterprise communication with 100% uptime during campaigns",
      technologies: ["VoIP", "SIP", "Asterisk", "FreePBX"],
      color: "bg-purple-50",
      featured: true,
      order: 3,
    },
    {
      title: "SaaS Platform Development",
      description: "Led multiple SaaS and web application projects from planning to production release",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe"],
      color: "bg-orange-50",
      featured: true,
      order: 4,
    },
    {
      title: "ERP & CRM Systems",
      description: "Delivered ERP, CRM, and automation projects for international clients including Sterling Carter Technology",
      technologies: ["Laravel", "Python", "MySQL", "APIs"],
      color: "bg-pink-50",
      featured: false,
      order: 5,
    },
    {
      title: "Live Streaming Infrastructure",
      description: "Maintained near 100% uptime across live streaming platforms during high-traffic campaigns",
      technologies: ["OBS", "RTMP", "CDN", "Load Balancing"],
      color: "bg-cyan-50",
      featured: false,
      order: 6,
    },
  ]).onConflictDoNothing();

  // Seed blog posts
  await db.insert(blogPosts).values([
    {
      title: "Building High-Availability Cloud Infrastructure",
      excerpt: "Best practices for AWS and Linux VPS management in enterprise environments.",
      content: "<p>Managing cloud infrastructure requires careful planning, monitoring, and optimization. In this post, I share key strategies for maintaining 99.99% uptime across your systems.</p><h3>Key Strategies</h3><ul><li>Implement redundant systems across availability zones</li><li>Use automated health checks and failover</li><li>Monitor with Prometheus and Grafana</li><li>Regular capacity planning and load testing</li></ul>",
      tags: ["Cloud", "AWS", "DevOps"],
      published: true,
    },
    {
      title: "Automating IT Operations with Python",
      excerpt: "How Python scripts can transform your IT monitoring and alert systems.",
      content: "<p>Automation is key to scaling IT operations. This guide covers building monitoring systems that detect issues before they impact users.</p><h3>Topics Covered</h3><ul><li>Real-time log analysis</li><li>Automated alerting via Slack/Email</li><li>Self-healing infrastructure scripts</li><li>Performance optimization triggers</li></ul>",
      tags: ["Python", "Automation", "IT"],
      published: true,
    },
    {
      title: "Managing Cross-Cultural Tech Teams",
      excerpt: "Lessons learned from leading teams across China, India, and Gulf regions.",
      content: "<p>Working with multicultural teams presents unique challenges and opportunities. Here's what I've learned about effective communication and project delivery.</p>",
      tags: ["Leadership", "Management", "Teams"],
      published: true,
    },
    {
      title: "SEO Technical Optimization Guide",
      excerpt: "Log file analysis and crawl budget optimization for better search rankings.",
      content: "<p>Technical SEO requires understanding how search engines crawl your site. This guide covers log analysis and optimization techniques.</p>",
      tags: ["SEO", "Technical", "Analytics"],
      published: true,
    },
    {
      title: "VoIP Systems for Enterprise",
      excerpt: "Implementing and maintaining enterprise communication systems.",
      content: "<p>VoIP systems are the backbone of modern enterprise communication. Learn about setup, maintenance, and troubleshooting.</p>",
      tags: ["VoIP", "Enterprise", "Communication"],
      published: true,
    },
  ]).onConflictDoNothing();

  // Seed experience from actual resume
  await db.insert(experience).values([
    {
      role: "IT Project Coordinator / Technical Lead",
      company: "Port City BPO",
      location: "Sri Lanka",
      period: "January 2026 – Present",
      highlights: [
        "Led decision-making across IT infrastructure including servers, VoIP systems, applications, and software platforms",
        "Managed and maintained core systems on AWS and Linux VPS environments, ensuring high availability and system stability",
        "Built backend monitoring and alert systems using Python to detect issues and automatically optimize system performance",
        "Designed and delivered custom internal and external applications, including API integrations based on business requirements",
        "Managed IT and resource budgets, optimizing infrastructure costs and improving operational efficiency",
        "Worked with multicultural teams (China, India, Gulf regions) to deliver projects on time and maintain performance standards",
        "Maintained near 100% uptime across platforms, including live streaming systems during high-traffic campaigns",
      ],
      order: 1,
      current: true,
    },
    {
      role: "Senior IT Manager / Project Lead",
      company: "Code Studio Global",
      location: "Sri Lanka",
      period: "May 2025 – January 2026",
      highlights: [
        "Led multiple SaaS and web application projects from planning to production release",
        "Defined project scope, timelines, milestones, and deliverables",
        "Coordinated developers, designers, and stakeholders to ensure smooth execution",
        "Managed risks, change requests, and quality assurance processes",
        "Ensured projects were delivered on time and met business requirements",
      ],
      order: 2,
      current: false,
    },
    {
      role: "IT Consultant / Project-Based Lead",
      company: "Freelance | Remote",
      location: "Remote",
      period: "January 2023 – January 2024",
      highlights: [
        "Delivered ERP, CRM, and automation projects for international clients",
        "Managed full project lifecycle including planning, execution, testing, and handover",
        "Communicated directly with clients to manage expectations and timelines",
        "Key client: Sterling Carter Technology, Kingston, Jamaica",
      ],
      order: 3,
      current: false,
    },
    {
      role: "DevOps Engineer",
      company: "Sterling Carter Technology Distributors",
      location: "Kingston, Jamaica",
      period: "January 2021 – May 2023",
      highlights: [
        "Performed Log File Analysis to identify crawl budget inefficiencies and optimize server response times across WordPress infrastructures",
        "Identified security vulnerabilities and strengthened API endpoints for real-time inventory integrations",
        "Coded Python scripts for large-scale data cleansing and MySQL database optimization",
        "Developed and maintained automated CI/CD pipelines to ensure seamless deployment of technical SEO enhancements",
      ],
      order: 4,
      current: false,
    },
  ]).onConflictDoNothing();

  // Seed skills from resume
  await db.insert(skills).values([
    // Leadership & Management
    { name: "Team Leadership", category: "Management", order: 1 },
    { name: "Project Management", category: "Management", order: 2 },
    { name: "Stakeholder Management", category: "Management", order: 3 },
    { name: "Risk & Change Management", category: "Management", order: 4 },
    { name: "Resource Planning", category: "Management", order: 5 },
    { name: "Budgeting", category: "Management", order: 6 },
    // Technical
    { name: "AWS", category: "Cloud & DevOps", order: 1 },
    { name: "Linux VPS", category: "Cloud & DevOps", order: 2 },
    { name: "CI/CD Pipelines", category: "Cloud & DevOps", order: 3 },
    { name: "Docker", category: "Cloud & DevOps", order: 4 },
    // Backend
    { name: "Python", category: "Backend", order: 1 },
    { name: "API Development", category: "Backend", order: 2 },
    { name: "MySQL", category: "Backend", order: 3 },
    { name: "PostgreSQL", category: "Backend", order: 4 },
    // Methodologies
    { name: "Agile", category: "Methodologies", order: 1 },
    { name: "Waterfall", category: "Methodologies", order: 2 },
    { name: "Scrum", category: "Methodologies", order: 3 },
    // SaaS & Platforms
    { name: "VoIP Systems", category: "Platforms", order: 1 },
    { name: "SaaS Platforms", category: "Platforms", order: 2 },
    { name: "CRM Development", category: "Platforms", order: 3 },
    { name: "ERP Systems", category: "Platforms", order: 4 },
  ]).onConflictDoNothing();

  // Seed socials
  await db.insert(socials).values([
    {
      platform: "Email",
      label: "Email",
      value: "2002yazeedfaumy@gmail.com",
      href: "mailto:2002yazeedfaumy@gmail.com",
      order: 1,
    },
    {
      platform: "LinkedIn",
      label: "LinkedIn",
      value: "linkedin.com/in/yazeedfaumy",
      href: "https://linkedin.com/in/yazeedfaumy",
      order: 2,
    },
    {
      platform: "GitHub",
      label: "GitHub",
      value: "github.com/yazeedfaumy",
      href: "https://github.com/yazeedfaumy",
      order: 3,
    },
    {
      platform: "Phone",
      label: "Phone",
      value: "+94 75 920 1455",
      href: "tel:+94759201455",
      order: 4,
    },
  ]).onConflictDoNothing();

  // Seed footer links
  await db.insert(footerLinks).values([
    { label: "LinkedIn", href: "https://linkedin.com/in/yazeedfaumy", order: 1 },
    { label: "GitHub", href: "https://github.com/yazeedfaumy", order: 2 },
    { label: "Email", href: "mailto:2002yazeedfaumy@gmail.com", order: 3 },
  ]).onConflictDoNothing();

  // Seed LinkedIn posts
  await db.insert(linkedinPosts).values([
    {
      content: "Excited to share that we achieved 99.99% uptime across all our cloud infrastructure this quarter! Proper monitoring and automation make all the difference.",
      date: "2 days ago",
      likes: 78,
      comments: 15,
    },
    {
      content: "Just wrapped up a successful SaaS platform launch with the team at Code Studio Global. From planning to production in record time!",
      date: "1 week ago",
      likes: 52,
      comments: 12,
    },
  ]).onConflictDoNothing();

  // Seed mock GitHub contributions (last 180 days)
  const today = new Date();
  const contributions = Array.from({ length: 180 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (179 - i));
    const count = Math.random() > 0.6 ? Math.floor(Math.random() * 8) : 0;
    const level = count > 0 ? Math.min(Math.floor(count / 2) + 1, 4) : 0;
    return {
      date: date.toISOString().split('T')[0],
      count,
      level,
    };
  });

  await db.insert(githubContributions).values(contributions).onConflictDoNothing();

  console.log("Database seeded successfully with Mohamed Yazeed Faumy's portfolio data!");
}

seed().catch(console.error).finally(() => process.exit());
