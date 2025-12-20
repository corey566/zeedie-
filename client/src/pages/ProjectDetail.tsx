
import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowLeft, Loader2, ExternalLink, Github } from 'lucide-react';
import { fetchProject, fetchProjectSections } from '@/lib/api';
import Footer from '@/components/Footer';

export default function ProjectDetail() {
  const { id } = useParams();
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => fetchProject(id!),
  });

  const { data: sections = [], isLoading: sectionsLoading } = useQuery({
    queryKey: ['project-sections', id],
    queryFn: () => fetchProjectSections(id!),
  });

  if (projectLoading || sectionsLoading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-display mb-4">Project not found</h1>
          <Link href="/projects">
            <button className="text-black/60 hover:text-black">← Back to Projects</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-5xl mx-auto">
        <Link href="/projects">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 text-black/60 hover:text-black mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" /> Back to Projects
          </motion.button>
        </Link>

        {/* Project Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm mb-8"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full">
                Project Details
              </span>
              <h1 className="font-display text-5xl md:text-7xl mt-4 mb-4 leading-[0.9] tracking-tighter">
                {project.title}
              </h1>
              <p className="text-xl text-black/60 mb-6">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {(project.technologies || []).map((tech: string, i: number) => (
                  <span
                    key={i}
                    className="px-4 py-2 text-sm bg-black/5 border border-black/10 rounded-xl font-medium"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 ml-4">
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  <Github className="w-5 h-5" />
                </a>
              )}
              {project.projectUrl && (
                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center hover:bg-black hover:text-white transition-all"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </motion.div>

        {/* Project Content Sections */}
        {sections.map((section: any, index: number) => (
          <motion.div
            key={section.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm mb-8"
          >
            {section.title && (
              <h2 className="font-display text-3xl md:text-4xl mb-6">{section.title}</h2>
            )}

            <div className={`prose prose-lg max-w-none ${getImageLayoutClass(section.imageAlignment, section.imageUrl)}`}>
              {section.imageUrl && (section.imageAlignment === 'top' || !section.imageAlignment) && (
                <div className="mb-6">
                  <img
                    src={section.imageUrl}
                    alt={section.imageCaption || section.title || 'Project image'}
                    className="w-full rounded-2xl"
                  />
                  {section.imageCaption && (
                    <p className="text-sm text-black/60 mt-2 text-center italic">{section.imageCaption}</p>
                  )}
                </div>
              )}

              {section.imageUrl && section.imageAlignment === 'left' && (
                <div className="float-left mr-6 mb-4 max-w-md">
                  <img
                    src={section.imageUrl}
                    alt={section.imageCaption || section.title || 'Project image'}
                    className="w-full rounded-2xl"
                  />
                  {section.imageCaption && (
                    <p className="text-sm text-black/60 mt-2 italic">{section.imageCaption}</p>
                  )}
                </div>
              )}

              {section.imageUrl && section.imageAlignment === 'right' && (
                <div className="float-right ml-6 mb-4 max-w-md">
                  <img
                    src={section.imageUrl}
                    alt={section.imageCaption || section.title || 'Project image'}
                    className="w-full rounded-2xl"
                  />
                  {section.imageCaption && (
                    <p className="text-sm text-black/60 mt-2 italic">{section.imageCaption}</p>
                  )}
                </div>
              )}

              {section.imageUrl && section.imageAlignment === 'center' && (
                <div className="mx-auto mb-6 max-w-3xl">
                  <img
                    src={section.imageUrl}
                    alt={section.imageCaption || section.title || 'Project image'}
                    className="w-full rounded-2xl"
                  />
                  {section.imageCaption && (
                    <p className="text-sm text-black/60 mt-2 text-center italic">{section.imageCaption}</p>
                  )}
                </div>
              )}

              <div dangerouslySetInnerHTML={{ __html: section.content }} />

              {section.imageUrl && section.imageAlignment === 'bottom' && (
                <div className="mt-6">
                  <img
                    src={section.imageUrl}
                    alt={section.imageCaption || section.title || 'Project image'}
                    className="w-full rounded-2xl"
                  />
                  {section.imageCaption && (
                    <p className="text-sm text-black/60 mt-2 text-center italic">{section.imageCaption}</p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        ))}

        {sections.length === 0 && (
          <div className="bg-white p-12 rounded-[2.5rem] shadow-sm text-center">
            <p className="text-black/40">No additional details available for this project yet.</p>
          </div>
        )}

        <Footer />
      </div>
    </div>
  );
}

function getImageLayoutClass(alignment: string | null, hasImage: string | null) {
  if (!hasImage) return '';
  if (alignment === 'left' || alignment === 'right') return 'overflow-auto';
  return '';
}
