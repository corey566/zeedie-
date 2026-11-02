import { db } from "@db";
import {
  profile,
  projects,
  experience,
  skills,
  socials,
  footerLinks,
} from "@shared/schema";

/**
 * Seeds factual portfolio content for Mohamed Yazeed Faumy.
 *
 * This script intentionally does not create fabricated blog posts,
 * LinkedIn activity, GitHub contribution data, uptime figures, or project
 * outcomes. Existing rows are left untouched by onConflictDoNothing().
 *
 * Review the content and confirm dates before running against production.
 */
async function seed() {
  console.log("Seeding ZEEDIE with verified portfolio information...");

  await db.insert(profile).values({
    name: "Mohamed Yazeed Faumy",
    role: "Full-Stack Software Engineer & Product Developer",
    email: "2002yazeedfaumy@gmail.com",
    location: "Sri Lanka",
    bio: "A multidisciplinary software professional with experience in freelance development and software engineering, building web applications, business platforms and digital products. Works across React, Next.js, JavaScript, backend integrations, PostgreSQL, Prisma and practical deployment workflows, with additional experience in SEO, digital marketing, IT operations and technical project coordination.",
    profileImage: null,
    yearsExperience: 4,
    projectsShipped: null,
  }).onConflictDoNothing();

  await db.insert(experience).values([
    {
      role: "Executive SEO Specialist",
      company: "Code City BPO",
      location: "Sri Lanka",
      period: "January 2026 – September 2026",
      highlights: [
        "Worked across SEO and digital marketing responsibilities.",
        "Contributed to marketing design and website-related work.",
        "Supported backend, web, mobile and application platform development.",
        "Handled internal technical operations, including network and device maintenance.",
        "Supervised and coordinated developers.",
      ],
      order: 1,
      current: false,
    },
    {
      role: "Software Engineer",
      company: "Code Studio Global",
      location: "Sri Lanka",
      period: "May 2025 – January 2026",
      highlights: [
        "Worked as the company's only engineer during the period described.",
        "Rebuilt the company's website.",
        "Contributed to software and SaaS-related development work.",
      ],
      order: 2,
      current: false,
    },
    {
      role: "Software Engineer",
      company: "Sterling Carter Technology Distributors",
      location: "Remote / International",
      period: "January 2024 – April 2025",
      highlights: [
        "Worked in a software engineering role.",
        "Contributed to software development and technical delivery.",
      ],
      order: 3,
      current: false,
    },
    {
      role: "Freelance Software Developer",
      company: "Independent",
      location: "Remote",
      period: "January 2022 – December 2023",
      highlights: [
        "Completed freelance work before moving into a full-time software engineering role.",
        "Worked independently on software and web-development assignments.",
      ],
      order: 4,
      current: false,
    },
  ]).onConflictDoNothing();

  await db.insert(projects).values([
    {
      title: "Afluma Commerce",
      description: "A multi-tenant commerce platform initiative covering storefronts, tenant administration, client portals, authentication and platform-level management. Presented as product development and architecture work; production launch status should be confirmed before claiming a public release.",
      technologies: ["React", "Node.js", "Prisma", "PostgreSQL"],
      color: "bg-violet-50",
      featured: true,
      order: 1,
    },
    {
      title: "GNConnect",
      description: "A modernisation project for a legacy community records system, planned around structured household and resident data, multilingual workflows and an isolated development database.",
      technologies: ["Next.js", "PostgreSQL", "Prisma", "Tailwind CSS", "Docker"],
      color: "bg-blue-50",
      featured: true,
      order: 2,
    },
    {
      title: "Commander OS",
      description: "A local-first desktop application project exploring a unified workspace, voice and chat interactions, and agent-oriented orchestration.",
      technologies: ["Tauri", "Vite", "JavaScript"],
      color: "bg-slate-50",
      featured: true,
      order: 3,
    },
    {
      title: "Travel Lanka",
      description: "A tourism-platform tender and product-planning initiative covering visitor services, travel integrations, supplier workflows, delivery planning and quality assurance.",
      technologies: ["Product Architecture", "API Research", "Project Planning", "QA Planning"],
      color: "bg-emerald-50",
      featured: true,
      order: 4,
    },
    {
      title: "Ink Paradise",
      description: "An e-commerce redesign initiative for printer supplies, including product categorisation, business quotation workflows and an ink-coverage estimation feature.",
      technologies: ["React", "E-commerce", "UX Planning"],
      color: "bg-orange-50",
      featured: false,
      order: 5,
    },
    {
      title: "Luckgem",
      description: "A jewellery storefront initiative focused on product presentation, diamond and gemstone information, social links and administrative content management.",
      technologies: ["React", "E-commerce", "Web Development"],
      color: "bg-rose-50",
      featured: false,
      order: 6,
    },
  ]).onConflictDoNothing();

  await db.insert(skills).values([
    { name: "React", category: "Frontend", order: 1 },
    { name: "Next.js", category: "Frontend", order: 2 },
    { name: "JavaScript", category: "Frontend", order: 3 },
    { name: "TypeScript", category: "Frontend", order: 4 },
    { name: "HTML5", category: "Frontend", order: 5 },
    { name: "CSS3", category: "Frontend", order: 6 },
    { name: "Tailwind CSS", category: "Frontend", order: 7 },
    { name: "Vite", category: "Frontend", order: 8 },
    { name: "Node.js", category: "Backend", order: 1 },
    { name: "Express.js", category: "Backend", order: 2 },
    { name: "Strapi", category: "Backend", order: 3 },
    { name: "PHP", category: "Backend", order: 4 },
    { name: "Python (data processing)", category: "Backend", order: 5 },
    { name: "REST API integration", category: "Backend", order: 6 },
    { name: "PostgreSQL", category: "Databases", order: 1 },
    { name: "Prisma ORM", category: "Databases", order: 2 },
    { name: "SQL", category: "Databases", order: 3 },
    { name: "Database modelling", category: "Databases", order: 4 },
    { name: "Docker", category: "Infrastructure", order: 1 },
    { name: "Docker Compose", category: "Infrastructure", order: 2 },
    { name: "Linux server operations", category: "Infrastructure", order: 3 },
    { name: "Cloudflare and DNS", category: "Infrastructure", order: 4 },
    { name: "Git and GitHub", category: "Tools", order: 1 },
    { name: "Technical SEO", category: "SEO & Digital Growth", order: 1 },
    { name: "Google Search Console", category: "SEO & Digital Growth", order: 2 },
    { name: "Website optimisation", category: "SEO & Digital Growth", order: 3 },
    { name: "Digital marketing", category: "SEO & Digital Growth", order: 4 },
    { name: "Requirements analysis", category: "Product & Delivery", order: 1 },
    { name: "Technical project planning", category: "Product & Delivery", order: 2 },
    { name: "Developer coordination", category: "Product & Delivery", order: 3 },
    { name: "Quality assurance planning", category: "Product & Delivery", order: 4 },
    { name: "IT troubleshooting", category: "IT Operations", order: 1 },
    { name: "Device and network support", category: "IT Operations", order: 2 },
    { name: "Email and DNS troubleshooting", category: "IT Operations", order: 3 },
  ]).onConflictDoNothing();

  await db.insert(socials).values([
    {
      platform: "Email",
      label: "Email",
      value: "2002yazeedfaumy@gmail.com",
      href: "mailto:2002yazeedfaumy@gmail.com",
      order: 1,
    },
    {
      platform: "GitHub",
      label: "GitHub",
      value: "github.com/corey566",
      href: "https://github.com/corey566",
      order: 2,
    },
  ]).onConflictDoNothing();

  await db.insert(footerLinks).values([
    { label: "GitHub", href: "https://github.com/corey566", order: 1 },
    { label: "Email", href: "mailto:2002yazeedfaumy@gmail.com", order: 2 },
  ]).onConflictDoNothing();

  console.log("ZEEDIE portfolio content seeded. Add education and verified media through the admin panel when confirmed.");
}

seed().catch((error) => {
  console.error("Portfolio seed failed:", error);
  process.exitCode = 1;
}).finally(() => process.exit());
