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
  console.log("Seeding database...");

  // Seed profile
  await db.insert(profile).values({
    name: "ZEEDIE",
    role: "Full Stack Developer",
    email: "hello@zeedie.dev",
    location: "Kingston, Jamaica",
    bio: "Crafting digital experiences that merge artistic vision with engineering precision.",
    profileImage: "/assets/stock_images/professional_develop_ccee3624.jpg",
    yearsExperience: 5,
    projectsShipped: 50,
  }).onConflictDoNothing();

  // Seed projects
  await db.insert(projects).values([
    {
      title: "card.lk",
      description: "Leading digital vCard platform in Sri Lanka",
      technologies: ["Laravel", "React", "PostgreSQL"],
      color: "bg-blue-50",
      featured: true,
      order: 1,
    },
    {
      title: "Hola.lk",
      description: "Geolocation-based HRM with real-time GPS tracking & attendance automation",
      technologies: ["Node.js", "React", "PostgreSQL", "Maps API"],
      color: "bg-green-50",
      featured: true,
      order: 2,
    },
    {
      title: "Ink Coverage Estimator",
      description: "Document analysis & ink cost prediction tool for printing companies",
      technologies: ["Python", "OpenCV", "Laravel", "Vue"],
      color: "bg-purple-50",
      featured: false,
      order: 3,
    },
    {
      title: "Laravel SaaS Website Builder",
      description: "No-code platform enabling organizations to create and sell websites",
      technologies: ["Laravel", "Stripe", "PostgreSQL"],
      color: "bg-orange-50",
      featured: true,
      order: 4,
    },
    {
      title: "ERP & POS Systems",
      description: "Custom inventory, accounting, and point-of-sale solutions",
      technologies: ["Laravel", "React", "MySQL"],
      color: "bg-pink-50",
      featured: false,
      order: 5,
    },
    {
      title: "Corporate Websites",
      description: "Professional WordPress & React builds for youchoose.lk, ecoagri.lk, otc.lk, fonehouse.lk",
      technologies: ["WordPress", "React", "WooCommerce"],
      color: "bg-gray-50",
      featured: false,
      order: 6,
    },
  ]).onConflictDoNothing();

  // Seed blog posts
  await db.insert(blogPosts).values([
    {
      title: "The Future of Frontend Architecture",
      excerpt: "Exploring the shift towards server components and edge rendering.",
      content: "Full article content would go here...",
      tags: ["Frontend", "Architecture"],
      published: true,
    },
    {
      title: "Mastering Framer Motion Animations",
      excerpt: "A deep dive into complex layout animations and gestures.",
      content: "Full article content would go here...",
      tags: ["Animation", "React"],
      published: true,
    },
    {
      title: "Why Minimalism Matters in UI",
      excerpt: "How reducing cognitive load improves conversion rates.",
      content: "Full article content would go here...",
      tags: ["Design", "UX"],
      published: true,
    },
    {
      title: "Scaling PostgreSQL for Enterprise",
      excerpt: "Best practices for indexing, partitioning, and query optimization.",
      content: "Full article content would go here...",
      tags: ["Database", "Backend"],
      published: true,
    },
    {
      title: "Integrating AI into Legacy Systems",
      excerpt: "Strategies for modernizing existing applications with LLM capabilities.",
      content: "Full article content would go here...",
      tags: ["AI", "Legacy Code"],
      published: true,
    },
  ]).onConflictDoNothing();

  // Seed experience
  await db.insert(experience).values([
    {
      role: "In-House Developer & Digital Media Manager",
      company: "Sterling Carter Technology Distributors",
      location: "Kingston, Jamaica",
      period: "2021 – 2023",
      highlights: [
        "Maintained and developed SaaS platforms: zimozo.com / zimozo.lk",
        "Built card.lk (leading digital vCard platform in Sri Lanka)",
        "Developed Hola.lk geolocation-based HRM with real-time GPS tracking",
        "Integrated major U.S. distributor APIs (Ingram Micro, HP USA, Clover)",
        "Invented Ink Coverage Estimator (adopted by large printing companies)",
      ],
      order: 1,
      current: false,
    },
    {
      role: "Freelance Full-Stack Developer",
      company: "Upwork & Fiverr",
      location: "Remote",
      period: "2023 – Present",
      highlights: [
        "Delivered WordPress, Laravel, and custom ERP solutions",
        "Built CRM dashboards and admin panels",
        "Integrated Meta APIs for marketing automation",
        "Developed POS systems using n8n automation",
        "Consistently rated 5-stars by international clients",
      ],
      order: 2,
      current: true,
    },
  ]).onConflictDoNothing();

  // Seed skills
  await db.insert(skills).values([
    { name: "React", category: "Frontend", order: 1 },
    { name: "TypeScript", category: "Frontend", order: 2 },
    { name: "Next.js", category: "Frontend", order: 3 },
    { name: "Node.js", category: "Backend", order: 1 },
    { name: "Tailwind CSS", category: "Frontend", order: 4 },
    { name: "Framer Motion", category: "Frontend", order: 5 },
    { name: "PostgreSQL", category: "Database", order: 1 },
    { name: "GraphQL", category: "Backend", order: 2 },
    { name: "AWS", category: "DevOps", order: 1 },
    { name: "Figma", category: "Design", order: 1 },
  ]).onConflictDoNothing();

  // Seed socials
  await db.insert(socials).values([
    {
      platform: "Email",
      label: "Email",
      value: "hello@zeedie.dev",
      href: "mailto:hello@zeedie.dev",
      order: 1,
    },
    {
      platform: "LinkedIn",
      label: "LinkedIn",
      value: "linkedin.com/in/zeedie",
      href: "https://linkedin.com",
      order: 2,
    },
    {
      platform: "GitHub",
      label: "GitHub",
      value: "github.com/zeedie",
      href: "https://github.com",
      order: 3,
    },
    {
      platform: "Twitter",
      label: "Twitter",
      value: "@zeedie",
      href: "https://twitter.com",
      order: 4,
    },
  ]).onConflictDoNothing();

  // Seed footer links
  await db.insert(footerLinks).values([
    { label: "Twitter", href: "https://twitter.com", order: 1 },
    { label: "LinkedIn", href: "https://linkedin.com", order: 2 },
    { label: "GitHub", href: "https://github.com", order: 3 },
    { label: "Instagram", href: "https://instagram.com", order: 4 },
  ]).onConflictDoNothing();

  // Seed LinkedIn posts
  await db.insert(linkedinPosts).values([
    {
      content: "Just shipped a new SaaS dashboard using React and Tailwind. The performance gains with Vite are incredible! 🚀 #webdev #react #saas",
      date: "2 days ago",
      likes: 45,
      comments: 12,
    },
    {
      content: "Working on some complex GSAP animations for a client portfolio. Love how much life motion adds to the web. ✨",
      date: "1 week ago",
      likes: 32,
      comments: 8,
    },
  ]).onConflictDoNothing();

  // Seed mock GitHub contributions (last 180 days)
  const today = new Date();
  const contributions = Array.from({ length: 180 }).map((_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (179 - i));
    const count = Math.random() > 0.7 ? Math.floor(Math.random() * 5) : 0;
    const level = count > 0 ? Math.min(Math.floor(count / 2) + 1, 4) : 0;
    return {
      date: date.toISOString().split('T')[0],
      count,
      level,
    };
  });

  await db.insert(githubContributions).values(contributions).onConflictDoNothing();

  console.log("✅ Database seeded successfully!");
}

seed().catch(console.error).finally(() => process.exit());
