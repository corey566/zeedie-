import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary">About</span>
          <h1 className="font-display text-5xl md:text-6xl mt-4 mb-12">Full-Stack Engineer & Architect</h1>
        </motion.div>

        <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-foreground font-medium text-xl"
          >
            With over a decade of experience building enterprise-grade software solutions, I specialize in architecting scalable systems that handle millions of transactions while maintaining performance and reliability.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            My expertise spans full-stack development (React, Node.js, TypeScript), cloud infrastructure (AWS, Docker, Kubernetes), and modern DevOps practices. I've led teams of engineers, managed infrastructure at scale, and mentored junior developers to senior positions.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Beyond coding, I'm passionate about solving complex problems, writing clean maintainable code, and building products that users love. I approach every project with attention to performance, security, and user experience.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            When I'm not coding, you'll find me contributing to open-source projects, writing technical articles, or exploring emerging technologies like AI/ML and distributed systems.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 pt-16 border-t border-border"
        >
          <h2 className="font-display text-3xl mb-8">Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Excellence", desc: "Writing code that's maintainable, tested, and performs under pressure." },
              { title: "Innovation", desc: "Constantly learning and adopting new technologies to solve problems better." },
              { title: "Collaboration", desc: "Building great products requires great teams. Communication is key." },
            ].map((value, i) => (
              <div key={i} className="p-6 border border-border rounded-lg hover:bg-secondary transition-colors">
                <h3 className="font-display text-xl mb-3">{value.title}</h3>
                <p className="text-sm text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
