import { Home, User, Briefcase, Layers, Cpu, Mail, FileText, Linkedin, Github, Twitter } from 'lucide-react';

export const profile = {
  name: "ZEEDIE",
  role: "Full Stack Developer",
  email: "hello@zeedie.dev",
  location: "Kingston, Jamaica",
  socials: [
    { icon: Mail, label: 'Email', value: 'hello@zeedie.dev', href: 'mailto:hello@zeedie.dev' },
    { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/zeedie', href: 'https://linkedin.com' },
    { icon: Github, label: 'GitHub', value: 'github.com/zeedie', href: 'https://github.com' },
    { icon: Twitter, label: 'Twitter', value: '@zeedie', href: 'https://twitter.com' },
  ]
};

export const projects = [
  { 
    id: 'card-lk',
    title: 'card.lk', 
    desc: 'Leading digital vCard platform in Sri Lanka', 
    tech: ['Laravel', 'React', 'PostgreSQL'], 
    color: 'bg-blue-50',
    featured: true 
  },
  { 
    id: 'hola-lk',
    title: 'Hola.lk', 
    desc: 'Geolocation-based HRM with real-time GPS tracking & attendance automation', 
    tech: ['Node.js', 'React', 'PostgreSQL', 'Maps API'], 
    color: 'bg-green-50',
    featured: true 
  },
  { 
    id: 'ink-coverage',
    title: 'Ink Coverage Estimator', 
    desc: 'Document analysis & ink cost prediction tool for printing companies', 
    tech: ['Python', 'OpenCV', 'Laravel', 'Vue'], 
    color: 'bg-purple-50',
    featured: false
  },
  { 
    id: 'laravel-saas',
    title: 'Laravel SaaS Website Builder', 
    desc: 'No-code platform enabling organizations to create and sell websites', 
    tech: ['Laravel', 'Stripe', 'PostgreSQL'], 
    color: 'bg-orange-50',
    featured: true
  },
  { 
    id: 'erp-pos',
    title: 'ERP & POS Systems', 
    desc: 'Custom inventory, accounting, and point-of-sale solutions', 
    tech: ['Laravel', 'React', 'MySQL'], 
    color: 'bg-pink-50',
    featured: false
  },
  { 
    id: 'corp-sites',
    title: 'Corporate Websites', 
    desc: 'Professional WordPress & React builds for youchoose.lk, ecoagri.lk, otc.lk, fonehouse.lk', 
    tech: ['WordPress', 'React', 'WooCommerce'], 
    color: 'bg-gray-50',
    featured: false
  },
];

export const blogs = [
  {
    id: 'future-frontend',
    title: "The Future of Frontend Architecture",
    date: "Dec 12, 2024",
    excerpt: "Exploring the shift towards server components and edge rendering.",
    content: "Full article content would go here...",
    tags: ["Frontend", "Architecture"]
  },
  {
    id: 'mastering-framer',
    title: "Mastering Framer Motion Animations",
    date: "Nov 28, 2024",
    excerpt: "A deep dive into complex layout animations and gestures.",
    content: "Full article content would go here...",
    tags: ["Animation", "React"]
  },
  {
    id: 'minimalism-ui',
    title: "Why Minimalism Matters in UI",
    date: "Nov 15, 2024",
    excerpt: "How reducing cognitive load improves conversion rates.",
    content: "Full article content would go here...",
    tags: ["Design", "UX"]
  },
  {
    id: 'postgresql-scaling',
    title: "Scaling PostgreSQL for Enterprise",
    date: "Oct 05, 2024",
    excerpt: "Best practices for indexing, partitioning, and query optimization.",
    content: "Full article content would go here...",
    tags: ["Database", "Backend"]
  },
  {
    id: 'ai-integration',
    title: "Integrating AI into Legacy Systems",
    date: "Sep 22, 2024",
    excerpt: "Strategies for modernizing existing applications with LLM capabilities.",
    content: "Full article content would go here...",
    tags: ["AI", "Legacy Code"]
  }
];

export const experience = [
  {
    role: 'In-House Developer & Digital Media Manager',
    company: 'Sterling Carter Technology Distributors',
    location: 'Kingston, Jamaica',
    period: '2021 – 2023',
    highlights: [
      'Maintained and developed SaaS platforms: zimozo.com / zimozo.lk',
      'Built card.lk (leading digital vCard platform in Sri Lanka)',
      'Developed Hola.lk geolocation-based HRM with real-time GPS tracking',
      'Integrated major U.S. distributor APIs (Ingram Micro, HP USA, Clover)',
      'Invented Ink Coverage Estimator (adopted by large printing companies)',
    ],
  },
  {
    role: 'Freelance Full-Stack Developer',
    company: 'Upwork & Fiverr',
    location: 'Remote',
    period: '2023 – Present',
    highlights: [
      'Delivered WordPress, Laravel, and custom ERP solutions',
      'Built CRM dashboards and admin panels',
      'Integrated Meta APIs for marketing automation',
      'Developed POS systems using n8n automation',
      'Consistently rated 5-stars by international clients',
    ],
  },
];

export const linkedinPosts = [
  {
    id: 1,
    content: "Just shipped a new SaaS dashboard using React and Tailwind. The performance gains with Vite are incredible! 🚀 #webdev #react #saas",
    date: "2 days ago",
    likes: 45,
    comments: 12
  },
  {
    id: 2,
    content: "Working on some complex GSAP animations for a client portfolio. Love how much life motion adds to the web. ✨",
    date: "1 week ago",
    likes: 32,
    comments: 8
  }
];
