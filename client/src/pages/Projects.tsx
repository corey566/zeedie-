import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ExternalLink } from 'lucide-react';

const projects = [
  { title: 'card.lk', desc: 'Leading digital vCard platform in Sri Lanka', tech: ['Laravel', 'React', 'PostgreSQL'] },
  { title: 'Hola.lk', desc: 'Geolocation-based HRM with real-time GPS tracking & attendance automation', tech: ['Node.js', 'React', 'PostgreSQL', 'Maps API'] },
  { title: 'Ink Coverage Estimator', desc: 'Document analysis & ink cost prediction tool for printing companies', tech: ['Python', 'OpenCV', 'Laravel', 'Vue'] },
  { title: 'Laravel SaaS Website Builder', desc: 'No-code platform enabling organizations to create and sell websites', tech: ['Laravel', 'Stripe', 'PostgreSQL'] },
  { title: 'ERP & POS Systems', desc: 'Custom inventory, accounting, and point-of-sale solutions', tech: ['Laravel', 'React', 'MySQL'] },
  { title: 'Corporate Websites', desc: 'Professional WordPress & React builds for youchoose.lk, ecoagri.lk, otc.lk, fonehouse.lk', tech: ['WordPress', 'React', 'WooCommerce'] },
];

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gridRef.current) {
      gsap.from(gridRef.current.querySelectorAll('.project-card'), {
        scrollTrigger: {
          trigger: gridRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.6,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">Portfolio</span>
          <h1 className="font-display text-6xl md:text-7xl mt-6 mb-12 leading-tight">Projects & Solutions</h1>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className="project-card group relative overflow-hidden p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 cursor-pointer"
              whileHover={{ y: -8 }}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-300" />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-display text-2xl font-semibold group-hover:text-primary transition-colors flex-1">{project.title}</h3>
                  <ExternalLink className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-4" />
                </div>

                <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{project.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, j) => (
                    <motion.span
                      key={j}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: j * 0.05 }}
                      className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full font-medium group-hover:bg-primary/20 transition-colors"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
