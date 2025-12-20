import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

const experiences = [
  {
    role: "Senior Full-Stack Engineer",
    company: "TechCorp Inc",
    period: "2020 - Present",
    description: "Led development of scalable microservices architecture serving 2M+ users.",
    achievements: [
      "Architected real-time analytics platform processing 1B+ events daily",
      "Reduced API response time by 60% through optimization",
      "Mentored 5 junior engineers to senior positions",
    ],
  },
  {
    role: "Full-Stack Developer",
    company: "StartupXYZ",
    period: "2017 - 2020",
    description: "Built core platform features and infrastructure for growing SaaS product.",
    achievements: [
      "Implemented payment processing system handling $5M+ annually",
      "Designed PostgreSQL schemas for multi-tenant architecture",
      "Deployed to AWS with CI/CD pipeline reducing deployment time by 80%",
    ],
  },
  {
    role: "Junior Developer",
    company: "Digital Agency",
    period: "2015 - 2017",
    description: "Developed web applications and backend services for enterprise clients.",
    achievements: [
      "Built responsive web applications for 20+ clients",
      "Contributed to open-source projects",
      "Learned React, Node.js, and modern development practices",
    ],
  },
];

export default function Experience() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary">Career Journey</span>
          <h1 className="font-display text-5xl md:text-6xl mt-4 mb-12">Experience</h1>
        </motion.div>

        <div className="space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="border border-border rounded-lg p-8 hover:bg-secondary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-display text-2xl font-semibold">{exp.role}</h3>
                  <p className="text-muted-foreground">{exp.company}</p>
                </div>
                <span className="font-mono text-sm text-primary font-medium">{exp.period}</span>
              </div>

              <p className="text-muted-foreground mb-6">{exp.description}</p>

              <div className="space-y-3">
                <p className="text-sm font-semibold text-foreground">Key Achievements:</p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, j) => (
                    <li key={j} className="flex gap-3 text-sm text-muted-foreground">
                      <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
