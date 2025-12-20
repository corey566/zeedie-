import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ChevronRight } from 'lucide-react';

const experiences = [
  {
    role: 'In-House Developer & Digital Media Manager',
    company: 'Sterling Carter Technology Distributors (SCTDJM)',
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

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.querySelectorAll('.exp-card'), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        x: -50,
        stagger: 0.2,
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
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">Career</span>
          <h1 className="font-display text-6xl md:text-7xl mt-6 mb-12 leading-tight">Professional Experience</h1>
        </motion.div>

        <div ref={containerRef} className="space-y-8">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="exp-card group p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-display text-2xl font-semibold group-hover:text-primary transition-colors">{exp.role}</h3>
                  <p className="text-primary font-medium mt-1">{exp.company}</p>
                  <p className="text-sm text-muted-foreground">{exp.location}</p>
                </div>
                <span className="font-mono text-sm text-muted-foreground whitespace-nowrap ml-4">{exp.period}</span>
              </div>

              <div className="space-y-2 mt-6 pt-6 border-t border-border">
                {exp.highlights.map((highlight, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05 }}
                    className="flex gap-3 text-sm text-muted-foreground"
                  >
                    <ChevronRight className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
