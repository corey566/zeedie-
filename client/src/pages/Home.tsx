import { useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ArrowRight } from 'lucide-react';
import FloatingShape from '@/components/FloatingShape';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const highlightsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll('h1, p'), {
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1,
        },
        opacity: 0.3,
        y: 50,
      });
    }

    if (highlightsRef.current) {
      gsap.from(highlightsRef.current.querySelectorAll('.highlight-box'), {
        scrollTrigger: {
          trigger: highlightsRef.current,
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen pt-32 px-6 md:px-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            {/* Left Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.span variants={itemVariants} className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-6 px-3 py-1 bg-primary/10 rounded-full">
                Full-Stack Engineer & Automation Specialist
              </motion.span>
              
              <motion.h1 
                variants={itemVariants}
                className="font-display text-6xl md:text-7xl leading-tight tracking-tight mb-6"
              >
                Building Scalable SaaS & ERP Solutions
              </motion.h1>
              
              <motion.p variants={itemVariants} className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                Enterprise-grade systems for modern businesses. Specializing in SaaS platforms, ERP systems, and AI-powered automation.
              </motion.p>

              <motion.div variants={itemVariants} className="flex gap-4 flex-wrap mb-16">
                <Link href="/projects">
                  <motion.div className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-background font-medium hover:opacity-90 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer group">
                    View Projects <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </motion.div>
                </Link>
                <motion.button variants={itemVariants} className="inline-flex items-center gap-2 px-6 py-3 border-2 border-primary text-primary hover:bg-primary/10 transition-all duration-300 cursor-pointer font-medium">
                  Download CV
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right 3D Element */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="h-[500px] md:h-[600px] rounded-2xl overflow-hidden border-2 border-primary/20 bg-secondary/30 hover:border-primary/40 transition-colors"
            >
              <FloatingShape />
            </motion.div>

          </div>

          {/* Highlights Section */}
          <motion.div
            ref={highlightsRef}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-20 border-t border-border"
          >
            {[
              { number: '10+', label: 'Years Experience' },
              { number: '50+', label: 'Projects Delivered' },
              { number: '100%', label: 'Client Satisfaction' },
              { number: '5', label: 'Continents Served' },
            ].map((highlight, i) => (
              <motion.div
                key={i}
                variants={itemVariants}
                className="highlight-box group p-6 bg-secondary/50 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 cursor-default hover:scale-105"
              >
                <div className="font-display text-3xl font-bold group-hover:text-primary transition-colors">{highlight.number}</div>
                <div className="text-sm text-muted-foreground mt-2">{highlight.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Tech Stack Bento */}
      <section className="py-20 px-6 md:px-12 bg-secondary/5 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-3xl mb-12">Tech Stack</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['React', 'Laravel', 'Node.js', 'PostgreSQL', 'Python', 'AWS', 'WordPress', 'n8n'].map((tech, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-4 bg-background border-2 border-border rounded-lg hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-center font-medium hover:scale-105 cursor-default"
                >
                  {tech}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Projects Teaser */}
      <section className="py-20 px-6 md:px-12 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl">Featured Projects</h2>
            <Link href="/projects">
              <motion.div className="inline-flex items-center gap-2 text-primary hover:opacity-70 transition-opacity font-medium cursor-pointer group">
                View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </motion.div>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: 'card.lk', desc: 'Leading digital vCard platform in Sri Lanka', tech: 'Laravel, React' },
              { title: 'Hola.lk', desc: 'Geolocation-based HRM system with real-time tracking', tech: 'Node.js, PostgreSQL' },
            ].map((project, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                onClick={() => window.location.href = '/projects'}
                className="group p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105 cursor-pointer"
              >
                <h3 className="font-display text-2xl mb-2 group-hover:text-primary transition-colors">{project.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{project.desc}</p>
                <span className="text-xs text-primary font-medium">{project.tech}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>
    </div>
  );
}
