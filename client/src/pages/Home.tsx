import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import FloatingShape from "@/components/FloatingShape";

const highlights = [
  { number: "10+", label: "Years Experience" },
  { number: "50+", label: "Projects Delivered" },
  { number: "100%", label: "Client Satisfaction" },
  { number: "5", label: "Continents" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative min-h-screen pt-24 px-6 md:px-12 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4">
              Full-Stack Engineer
            </span>
            
            <h1 className="font-display text-5xl md:text-7xl leading-tight tracking-tight mb-6">
              Scalable SaaS & ERP Solutions
            </h1>
            
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              Building robust, high-performance systems for enterprise applications. Specializing in cloud architecture, AI automation, and real-time data processing.
            </p>

            <div className="flex gap-4 mb-16 flex-wrap">
              <Link href="/projects">
                <a className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-medium hover:opacity-90 transition-opacity cursor-pointer">
                  View Projects <ArrowRight className="w-4 h-4" />
                </a>
              </Link>
              <a href="#" className="inline-flex items-center gap-2 px-6 py-3 border border-border hover:bg-secondary transition-colors cursor-pointer">
                Download CV
              </a>
            </div>

            {/* Highlights Grid */}
            <div className="grid grid-cols-2 gap-6">
              {highlights.map((highlight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="border-l-2 border-primary pl-4"
                >
                  <div className="font-display text-3xl font-bold">{highlight.number}</div>
                  <div className="text-sm text-muted-foreground">{highlight.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right 3D Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden border border-border bg-secondary/30"
          >
            <FloatingShape />
          </motion.div>

        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 px-6 md:px-12 bg-secondary/10 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Technology Stack</span>
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8">
            {["React", "Node.js", "TypeScript", "PostgreSQL", "AWS", "Docker", "AI/ML", "GraphQL"].map((tech, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="p-4 border border-border rounded-lg hover:bg-secondary transition-colors text-center"
              >
                <span className="font-medium">{tech}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Work Teaser */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <h2 className="font-display text-3xl md:text-4xl">Featured Projects</h2>
          <Link href="/projects">
            <a className="inline-flex items-center gap-2 text-primary hover:opacity-70 transition-opacity cursor-pointer font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </a>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[
            { title: "Real-Time Analytics Platform", desc: "SaaS dashboard with WebSocket streaming" },
            { title: "ERP System Integration", desc: "Multi-tenant enterprise resource planning" },
          ].map((project, i) => (
            <motion.a
              key={i}
              href="/projects"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="group border border-border rounded-lg p-8 hover:bg-secondary transition-colors cursor-pointer"
            >
              <h3 className="font-display text-2xl mb-2 group-hover:translate-x-2 transition-transform">{project.title}</h3>
              <p className="text-muted-foreground">{project.desc}</p>
            </motion.a>
          ))}
        </div>
      </section>
    </div>
  );
}
