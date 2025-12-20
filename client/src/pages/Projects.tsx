import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ExternalLink, ArrowUpRight } from 'lucide-react';

const projects = [
  { title: 'card.lk', desc: 'Leading digital vCard platform in Sri Lanka', tech: ['Laravel', 'React', 'PostgreSQL'], color: 'bg-blue-50' },
  { title: 'Hola.lk', desc: 'Geolocation-based HRM with real-time GPS tracking & attendance automation', tech: ['Node.js', 'React', 'PostgreSQL', 'Maps API'], color: 'bg-green-50' },
  { title: 'Ink Coverage Estimator', desc: 'Document analysis & ink cost prediction tool for printing companies', tech: ['Python', 'OpenCV', 'Laravel', 'Vue'], color: 'bg-purple-50' },
  { title: 'Laravel SaaS Website Builder', desc: 'No-code platform enabling organizations to create and sell websites', tech: ['Laravel', 'Stripe', 'PostgreSQL'], color: 'bg-orange-50' },
  { title: 'ERP & POS Systems', desc: 'Custom inventory, accounting, and point-of-sale solutions', tech: ['Laravel', 'React', 'MySQL'], color: 'bg-pink-50' },
  { title: 'Corporate Websites', desc: 'Professional WordPress & React builds for youchoose.lk, ecoagri.lk, otc.lk, fonehouse.lk', tech: ['WordPress', 'React', 'WooCommerce'], color: 'bg-gray-50' },
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
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm mb-8"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full">Portfolio</span>
          <h1 className="font-display text-5xl md:text-7xl mt-4 mb-8 leading-[0.9] tracking-tighter">Projects & <span className="text-black/40">Solutions</span></h1>
        </motion.div>

        <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={i}
              className={`project-card group relative overflow-hidden p-8 md:p-12 ${project.color} rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[420px] flex flex-col justify-between`}
              whileHover={{ y: -8 }}
            >
              <div className="w-full flex justify-end mb-8">
                 <div className="w-14 h-14 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                    <ArrowUpRight className="w-6 h-6" />
                 </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="font-display text-4xl font-semibold mb-4 leading-tight">{project.title}</h3>
                <p className="text-black/60 text-lg mb-8 leading-relaxed max-w-md">{project.desc}</p>

                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, j) => (
                    <span
                      key={j}
                      className="px-4 py-2 text-sm bg-white/60 backdrop-blur-sm border border-black/5 rounded-xl font-medium"
                    >
                      {tech}
                    </span>
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
