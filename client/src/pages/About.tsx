import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(sectionRef.current.querySelectorAll('.fade-in'), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-6 md:px-12 pb-20">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">About Me</span>
          <h1 className="font-display text-6xl md:text-7xl mt-6 mb-12 leading-tight">Full-Stack Engineer with a Focus on Enterprise Solutions</h1>
        </motion.div>

        <div ref={sectionRef} className="space-y-8">
          <motion.div className="fade-in p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/30 transition-colors">
            <h3 className="font-display text-2xl mb-4">The Journey</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              My university experience focused heavily on syllabus completion rather than practical, industry-ready knowledge. While fundamentals were repeatedly taught, real-world application was limited. In 2020, I began my professional journey as a freelance developer, delivering my first production website using HTML, CSS, and JavaScript. This marked the start of continuous self-driven learning.
            </p>
          </motion.div>

          <motion.div className="fade-in p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/30 transition-colors">
            <h3 className="font-display text-2xl mb-4">Technical Evolution</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Inspired by the rise of AI, I built object recognition applications using Python and OpenCV, then expanded into React, Node.js, MERN-based projects, and Laravel-based enterprise systems. Over time, I specialized in building ERP platforms, geolocation systems, HR tracking tools, and SaaS applications.
            </p>
          </motion.div>

          <motion.div className="fade-in p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/30 transition-colors">
            <h3 className="font-display text-2xl mb-4">Current Focus</h3>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Today, I deliver measurable business value across multiple industries. From web scrapers that generate leads, to ERP systems processing millions in transactions, to automation workflows saving hours of manual work — every project is built with attention to performance, scalability, and user experience.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 pt-12 border-t border-border">
            {[
              { label: 'Languages', value: 'PHP, JavaScript, Python, Laravel' },
              { label: 'Specialties', value: 'ERP, SaaS, CRM, Automation' },
              { label: 'Industries', value: 'SaaS, Finance, Logistics, Printing' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="fade-in p-6 bg-primary/5 border-2 border-primary/20 rounded-lg hover:border-primary/50 transition-colors"
              >
                <p className="text-sm text-primary font-semibold mb-2">{item.label}</p>
                <p className="text-muted-foreground">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
