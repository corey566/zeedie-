import { motion } from 'framer-motion';
import { ChevronRight, Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchExperience } from '@/lib/api';

export default function Experience() {
  const { data: experiences = [], isLoading } = useQuery({ queryKey: ['experience'], queryFn: fetchExperience });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }

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

        <div className="space-y-6">
          {experiences.map((exp: any, i: number) => (
            <motion.div
              key={exp.id || i}
              className="exp-card group p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300"
              whileHover={{ scale: 1.01 }}
              data-testid={`card-experience-${exp.id || i}`}
            >
              <div className="flex flex-col md:flex-row items-start justify-between mb-8 gap-4">
                <div className="flex-1">
                  <h3 className="font-display text-3xl font-semibold mb-2">{exp.role}</h3>
                  <p className="text-xl text-black/60 font-medium">{exp.company}</p>
                  <p className="text-sm text-black/40 mt-1">{exp.location}</p>
                </div>
                <div className="flex items-center gap-2">
                  {exp.current && (
                    <span className="font-mono text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Current</span>
                  )}
                  <span className="font-mono text-sm bg-black text-white px-4 py-2 rounded-full whitespace-nowrap">{exp.period}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-black/5">
                {(exp.highlights || []).map((highlight: string, j: number) => (
                  <motion.div
                    key={j}
                    className="flex items-start gap-3 group/item"
                    whileHover={{ x: 5 }}
                  >
                    <ChevronRight className="w-5 h-5 text-black/20 group-hover/item:text-black/60 flex-shrink-0 mt-0.5 transition-colors" />
                    <span className="text-black/60 group-hover/item:text-black/80 transition-colors">{highlight}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-20 md:mt-32 mb-10 max-w-7xl mx-auto w-full text-center">
          <h2 className="font-display text-[10vw] leading-none tracking-tight text-black/10 select-none">
            ZEEDIE
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-sm font-medium opacity-60">
            <span>&copy; 2025 ZEEDIE Portfolio</span>
            <span className="hidden md:inline">&bull;</span>
            <div className="flex gap-6">
              <a href="#" className="hover:text-black">Twitter</a>
              <a href="#" className="hover:text-black">LinkedIn</a>
              <a href="#" className="hover:text-black">GitHub</a>
              <a href="#" className="hover:text-black">Instagram</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
