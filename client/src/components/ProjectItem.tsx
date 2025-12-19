import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

interface ProjectProps {
  title: string;
  category: string;
  year: string;
  index: number;
}

export default function ProjectItem({ title, category, year, index }: ProjectProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group relative flex items-baseline justify-between py-8 border-b border-border transition-colors hover:border-foreground/20 cursor-pointer"
    >
      <div className="flex items-baseline gap-4 md:gap-12 w-full">
        <span className="font-mono text-xs text-muted-foreground">0{index + 1}</span>
        <h3 className="text-3xl md:text-5xl font-display font-light group-hover:pl-4 transition-all duration-300 ease-out">
          {title}
        </h3>
      </div>
      
      <div className="flex items-center gap-8 md:gap-16 shrink-0">
        <span className="hidden md:block text-sm text-muted-foreground font-light">{category}</span>
        <span className="hidden md:block font-mono text-xs text-muted-foreground">{year}</span>
        <ArrowUpRight className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
      </div>

      {/* Hover Image Reveal could go here with a fixed position portal if desired, sticking to minimal text list as requested for "Minimal" feel */}
    </motion.div>
  );
}
