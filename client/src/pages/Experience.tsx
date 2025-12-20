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
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm mb-8"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full">Career</span>
          <h1 className="font-display text-5xl md:text-7xl mt-4 mb-8 leading-[0.9] tracking-tighter">Professional <span className="text-black/40">Experience</span></h1>
        </motion.div>

        <div ref={containerRef} className="space-y-6">
          {experiences.map((exp, i) => (
            <motion.div
              key={i}
              className="exp-card group p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-3xl font-semibold mb-2">{exp.role}</h3>
                  <p className="text-xl text-black/60 font-medium">{exp.company}</p>
                  <p className="text-sm text-black/40 mt-1">{exp.location}</p>
                </div>
                <span className="font-mono text-sm bg-black text-white px-4 py-2 rounded-full whitespace-nowrap">{exp.period}</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-black/5">
                {exp.highlights.map((highlight, j) => (
                  <motion.div
                    key={j}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: j * 0.05 }}
                    className="flex gap-3 text-base text-black/70 p-3 rounded-xl hover:bg-black/5 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-black flex-shrink-0 mt-0.5" />
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
