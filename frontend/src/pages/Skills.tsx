import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchSkills } from '@/lib/api';
import Footer from '@/components/Footer';

export default function Skills() {
  const { data: skills = [], isLoading } = useQuery({ queryKey: ['skills'], queryFn: fetchSkills });

  const skillGroups = skills.reduce((acc: any, skill: any) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {});

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
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full">Expertise</span>
          <h1 className="font-display text-5xl md:text-7xl mt-4 mb-8 leading-[0.9] tracking-tighter">Skills & <span className="text-black/40">Technologies</span></h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {Object.entries(skillGroups).map(([category, categorySkills]: [string, any], i: number) => (
            <motion.div
              key={category}
              className="group p-8 md:p-10 bg-white rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300"
              initial={{ opacity: 1 }}
              whileHover={{ y: -5 }}
              data-testid={`card-skill-category-${category.toLowerCase()}`}
            >
              <h3 className="font-display text-3xl mb-6">{category}</h3>
              <div className="flex flex-wrap gap-3">
                {categorySkills.map((skill: any, j: number) => (
                  <motion.span
                    key={skill.id || j}
                    className="px-4 py-2 text-base bg-black/5 text-black/80 rounded-xl font-medium group-hover:bg-black group-hover:text-white transition-colors cursor-default"
                    initial={{ opacity: 1 }}
                    whileHover={{ scale: 1.05 }}
                    data-testid={`skill-${skill.name?.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {skill.name}
                  </motion.span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm"
        >
          <h2 className="font-display text-3xl mb-6">Additional <span className="text-black/40">Highlights</span></h2>
          <div className="flex flex-wrap gap-3">
            {['Responsive Design', 'Git Version Control', 'CI/CD Pipelines', 'Unit Testing', 'Agile/Scrum', 'Performance Optimization'].map((skill, i) => (
              <motion.span
                key={i}
                className="px-4 py-2 text-base bg-black/5 text-black/80 rounded-xl font-medium"
                initial={{ opacity: 1 }}
                whileHover={{ scale: 1.05, backgroundColor: '#000', color: '#fff' }}
              >
                {skill}
              </motion.span>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
