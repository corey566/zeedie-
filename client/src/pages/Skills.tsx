import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const skillGroups = [
  {
    title: 'Backend',
    skills: ['PHP 8+', 'Laravel', 'REST APIs', 'ERP & CRM systems', 'OOP', 'Composer', 'Node.js'],
  },
  {
    title: 'Frontend',
    skills: ['JavaScript (ES6+)', 'React', 'jQuery', 'Custom Dashboards', 'Tailwind CSS', 'Vue.js'],
  },
  {
    title: 'CMS & Platforms',
    skills: ['WordPress', 'Plugins', 'Gutenberg', 'WooCommerce', 'Stripe Integration', 'PayPal Integration'],
  },
  {
    title: 'AI & Automation',
    skills: ['Python', 'OpenCV', 'AI-assisted Development', 'n8n Workflows', 'CRM Automation', 'Email Automation'],
  },
];

export default function Skills() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.from(containerRef.current.querySelectorAll('.skill-card'), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
      });

      gsap.from(containerRef.current.querySelectorAll('.skill-tag'), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 60%',
        },
        opacity: 0,
        scale: 0.8,
        stagger: 0.05,
        duration: 0.4,
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
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">Expertise</span>
          <h1 className="font-display text-6xl md:text-7xl mt-6 mb-12 leading-tight">Skills & Technologies</h1>
        </motion.div>

        <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {skillGroups.map((group, i) => (
            <motion.div
              key={i}
              className="skill-card group p-8 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:scale-105"
              whileHover={{ y: -5 }}
            >
              <h3 className="font-display text-2xl mb-6 group-hover:text-primary transition-colors">{group.title}</h3>
              <div className="flex flex-wrap gap-3">
                {group.skills.map((skill, j) => (
                  <motion.span
                    key={j}
                    className="skill-tag px-4 py-2 text-sm bg-primary/10 text-primary rounded-full font-medium group-hover:bg-primary/20 transition-colors cursor-default"
                    whileHover={{ scale: 1.1 }}
                  >
                    {skill}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Proficiency Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-8 bg-primary/5 border-2 border-primary/20 rounded-xl"
        >
          <h2 className="font-display text-3xl mb-12">Proficiency Levels</h2>
          <div className="space-y-8">
            {[
              { name: 'Full-Stack Development', level: 95 },
              { name: 'Backend Architecture', level: 90 },
              { name: 'Frontend Design', level: 85 },
              { name: 'System Design & Scalability', level: 92 },
              { name: 'Team Leadership & Mentoring', level: 88 },
            ].map((skill, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-foreground">{skill.name}</span>
                  <span className="text-sm text-primary font-semibold">{skill.level}%</span>
                </div>
                <div className="h-3 bg-border rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    transition={{ duration: 1.2, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
