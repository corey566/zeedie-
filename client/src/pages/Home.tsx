import { motion, useSpring, useMotionValue } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Suspense } from "react";
import ThreeScene from "../components/ThreeScene";
import InteractiveShape from "../components/InteractiveShape";
import ProjectItem from "../components/ProjectItem";
import { ArrowDown } from "lucide-react";

// Import stock images
import img1 from '@assets/stock_images/minimalist_architect_9b89207c.jpg';
import img2 from '@assets/stock_images/minimalist_architect_883f8d80.jpg';
import img3 from '@assets/stock_images/minimalist_architect_1e790704.jpg';
import img4 from '@assets/stock_images/minimalist_architect_2cd0d1ee.jpg';
import img5 from '@assets/stock_images/minimalist_architect_74bf2b82.jpg';

const projects = [
  { title: "Lumina Interface", category: "Design System", year: "2024", image: img1 },
  { title: "Apex Finance", category: "Fintech App", year: "2023", image: img2 },
  { title: "Mono Architecture", category: "Web Development", year: "2023", image: img3 },
  { title: "Vanguard", category: "Brand Identity", year: "2022", image: img4 },
  { title: "Echo Spaces", category: "3D Experience", year: "2022", image: img5 },
];

const skills = [
  { category: "Core", items: ["React", "Next.js", "TypeScript", "Node.js"] },
  { category: "Design", items: ["Figma", "Blender", "UI/UX", "Motion"] },
  { category: "Graphics", items: ["Three.js", "WebGL", "GSAP", "Shaders"] },
];

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [activeProject, setActiveProject] = useState<number | null>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background relative">
      
      {/* Floating Project Image */}
      <motion.div 
        className="fixed top-0 left-0 w-[300px] h-[400px] pointer-events-none z-50 hidden md:block overflow-hidden shadow-lg"
        style={{ 
          x: springX, 
          y: springY,
          translateX: "-50%",
          translateY: "-50%",
          opacity: activeProject !== null ? 1 : 0
        }}
      >
        {projects.map((project, i) => (
          <motion.img
            key={i}
            src={project.image}
            alt={project.title}
            className="absolute top-0 left-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ 
              opacity: activeProject === i ? 1 : 0,
              scale: activeProject === i ? 1 : 0.8
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </motion.div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-40 mix-blend-difference text-white">
        <span className="font-display font-bold tracking-tight text-xl">ALEXANDER</span>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#work" className="hover:opacity-70 transition-opacity">WORK</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">ABOUT</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">CONTACT</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 overflow-hidden">
        <Suspense fallback={null}>
          <ThreeScene />
        </Suspense>
        
        <div className="z-10 mt-20">
          <motion.h1 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[12vw] leading-[0.85] tracking-tighter font-medium"
          >
            CREATIVE<br/>
            DEVELOPER
          </motion.h1>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-12 md:ml-2 max-w-md"
          >
            <p className="text-lg md:text-xl font-light text-muted-foreground leading-relaxed">
              Crafting digital experiences with a focus on motion, typography, and interaction. Based in Zurich.
            </p>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-10 right-6 md:right-12 flex flex-col items-center gap-2"
        >
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground writing-vertical-rl">Scroll</span>
          <ArrowDown className="w-4 h-4 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* Editorial / About Section */}
      <section id="about" className="py-32 px-6 md:px-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Philosophy</span>
          </div>
          <div className="md:col-span-8">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="font-display text-3xl md:text-5xl leading-tight font-light"
            >
              I believe in design that serves a purpose. My work sits at the intersection of <span className="text-muted-foreground">technical precision</span> and <span className="text-muted-foreground">artistic expression</span>. I build interfaces that feel natural, intuitive, and remarkably fast.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="work" className="py-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
           <div className="mb-16 border-b border-border pb-4 flex justify-between items-end">
              <h2 className="font-display text-xl tracking-tight">SELECTED WORK</h2>
              <span className="font-mono text-xs text-muted-foreground">(2022 — 2024)</span>
           </div>
           
           <div className="flex flex-col relative z-10" onMouseLeave={() => setActiveProject(null)}>
             {projects.map((project, i) => (
               <div 
                 key={i} 
                 onMouseEnter={() => setActiveProject(i)}
                 className="relative bg-background/50 backdrop-blur-[2px]"
               >
                 <ProjectItem {...project} index={i} />
               </div>
             ))}
           </div>
        </div>
      </section>

      {/* Interactive 3D Lab Section */}
      <section className="py-32 px-6 md:px-12 bg-secondary/10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground block mb-6">Interactive Lab</span>
            <h2 className="font-display text-5xl md:text-7xl mb-8 leading-none">DIGITAL<br/>MATTER</h2>
            <p className="text-xl font-light text-muted-foreground max-w-sm">
              Exploring the boundaries of WebGL and creative coding. Interactions that feel tangible in a digital space.
            </p>
          </div>
          <div className="h-[500px] w-full bg-white rounded-none border border-border">
            <Suspense fallback={<div className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100" />}>
              <InteractiveShape />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 px-6 md:px-12 bg-secondary/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {skills.map((skillGroup, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <h3 className="font-mono text-xs uppercase tracking-widest mb-8 text-muted-foreground">{skillGroup.category}</h3>
                <ul className="space-y-4">
                  {skillGroup.items.map((skill, j) => (
                    <li key={j} className="text-2xl font-display font-light">{skill}</li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="min-h-[80vh] px-6 md:px-12 flex flex-col justify-between py-20">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Get in touch</span>
        </div>
        
        <div>
          <motion.a 
            href="mailto:hello@alexander.dev"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="block font-display text-[10vw] leading-none tracking-tighter hover:text-muted-foreground transition-colors"
          >
            HELLO@<br/>ALEXANDER.DEV
          </motion.a>
        </div>

        <div className="flex justify-between items-end border-t border-border pt-8">
          <div className="flex gap-8">
            <a href="#" className="font-mono text-sm hover:underline">TWITTER</a>
            <a href="#" className="font-mono text-sm hover:underline">LINKEDIN</a>
            <a href="#" className="font-mono text-sm hover:underline">GITHUB</a>
          </div>
          <span className="font-mono text-xs text-muted-foreground">© 2024</span>
        </div>
      </section>

    </div>
  );
}
