import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

const projects = [
  {
    title: "Real-Time Analytics Dashboard",
    description: "Enterprise SaaS platform for real-time data visualization and monitoring",
    tech: ["React", "Node.js", "WebSocket", "PostgreSQL", "AWS"],
    impact: "2M+ daily active users, 99.99% uptime",
  },
  {
    title: "Multi-Tenant ERP System",
    description: "Complete ERP solution with accounting, inventory, and HR modules",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL", "Docker"],
    impact: "$5M+ annual revenue processing",
  },
  {
    title: "AI-Powered Content Generator",
    description: "SaaS tool leveraging GPT-4 for automated content creation",
    tech: ["React", "FastAPI", "OpenAI API", "Redis", "Stripe"],
    impact: "1000+ active subscriptions",
  },
  {
    title: "Mobile Banking App",
    description: "Cross-platform mobile banking application with real-time transactions",
    tech: ["React Native", "Node.js", "MongoDB", "Kafka", "AWS"],
    impact: "500K+ downloads, 4.8★ rating",
  },
];

export default function Projects() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Portfolio</span>
          <h1 className="font-display text-5xl md:text-6xl mt-4 mb-12">Projects</h1>
        </motion.div>

        <div className="space-y-8">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group border border-border rounded-lg p-8 hover:bg-secondary/30 transition-all hover:border-primary cursor-pointer"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold group-hover:translate-x-2 transition-transform">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground mt-2">{project.description}</p>
                </div>
                <ExternalLink className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4" />
              </div>

              <div className="mt-6 flex flex-wrap gap-2 mb-6">
                {project.tech.map((tech, j) => (
                  <span
                    key={j}
                    className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="pt-6 border-t border-border">
                <p className="text-sm font-semibold text-foreground">Impact:</p>
                <p className="text-sm text-muted-foreground mt-1">{project.impact}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
