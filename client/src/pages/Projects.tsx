import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, Loader2, ExternalLink, Github } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '@/lib/api';
import { useLocation } from 'wouter';

export default function Projects() {
  const gridRef = useRef<HTMLDivElement>(null);
  const { data: projects = [], isLoading } = useQuery({ queryKey: ['projects'], queryFn: fetchProjects });
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (gridRef.current && projects.length > 0) {
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
  }, [projects]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }

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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project: any, i: number) => (
            <motion.div
              key={project.id || i}
              className={`group relative overflow-hidden p-8 md:p-12 ${project.color || 'bg-gray-50'} rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer min-h-[420px] flex flex-col justify-between`}
              whileHover={{ y: -8 }}
              data-testid={`card-project-${project.id || i}`}
              initial={{ opacity: 1 }}
              onClick={() => setLocation(`/projects/${project.id}`)}
            >
              <div className="w-full flex justify-end gap-2 mb-8">
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`link-github-${project.id}`}
                  >
                    <Github className="w-5 h-5" />
                  </a>
                )}
                {project.projectUrl && (
                  <a
                    href={project.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm"
                    onClick={(e) => e.stopPropagation()}
                    data-testid={`link-project-${project.id}`}
                  >
                    <ExternalLink className="w-5 h-5" />
                  </a>
                )}
                <div className="w-14 h-14 bg-white/50 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all shadow-sm">
                  <ArrowUpRight className="w-6 h-6" />
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="font-display text-4xl font-semibold mb-4 leading-tight">{project.title}</h3>
                <p className="text-black/60 text-lg mb-8 leading-relaxed max-w-md">{project.description}</p>

                <div className="flex flex-wrap gap-2">
                  {(project.technologies || []).map((tech: string, j: number) => (
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