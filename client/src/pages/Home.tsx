import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowDown, ChevronDown } from "lucide-react";

const projects = [
  { title: "Lumina Interface", category: "Design System", year: "2024" },
  { title: "Apex Finance", category: "Fintech App", year: "2023" },
  { title: "Mono Architecture", category: "Web Development", year: "2023" },
  { title: "Vanguard", category: "Brand Identity", year: "2022" },
  { title: "Echo Spaces", category: "3D Experience", year: "2022" },
];

const skills = [
  { category: "Core", items: ["React", "Next.js", "TypeScript", "Node.js"] },
  { category: "Design", items: ["Figma", "Blender", "UI/UX", "Motion"] },
  { category: "Graphics", items: ["Three.js", "WebGL", "GSAP", "Shaders"] },
];

const experience = [
  { 
    period: "2022-Present", 
    position: "Freelance",
    title: "Graphic Designer (Logo, Brand Identity, Social Media, etc)",
    startMonth: "Nov",
    endMonth: "Present"
  },
  { 
    period: "2022-Present", 
    position: "Etsy",
    title: "Seller (Watercolor Illustrations & Merch Design Templates)",
    startMonth: "Nov",
    endMonth: "Present"
  },
  { 
    period: "2021-2022", 
    position: "PT Kanaan Global Indonesia",
    title: "Junior Staff Of Industrial Engineering Team",
    startMonth: "Sept",
    endMonth: "Aug"
  },
];

const education = [
  {
    year: "2022",
    school: "Scala Expert",
    program: "UI/UX Bootcamp Course"
  },
  {
    year: "2017-2021",
    school: "Universitas Sebelas Maret",
    program: "Civil Engineering (GPA 3.59/4.00)"
  },
  {
    year: "2015-2017",
    school: "SMA N 1 Yogyakarta",
    program: "Science (GPA 83.4/100)"
  }
];

const hardSkills = [
  { name: "AI", color: "from-orange-400 to-orange-500" },
  { name: "Ps", color: "from-blue-500 to-blue-600" },
  { name: "Ae", color: "from-blue-400 to-blue-500" },
  { name: "Id", color: "from-red-500 to-red-600" },
  { name: "Xd", color: "from-purple-500 to-purple-600" },
  { name: "Figma", color: "from-purple-400 to-purple-500" },
];

const softSkills = [
  { label: "#Creativity", filled: true },
  { label: "#Teamwork", filled: false },
  { label: "#Time_Management", filled: false },
  { label: "#Flexibility", filled: false },
  { label: "#Communication", filled: true },
];

function ExperienceCard({ item, index }: { item: typeof experience[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-4 border border-border rounded-2xl p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <span className="inline-block bg-primary text-background text-xs font-bold px-3 py-1 rounded-full">
          {item.period}
        </span>
        <ChevronDown 
          className="w-5 h-5 text-muted-foreground transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      <div className="mt-4">
        <p className="text-sm text-muted-foreground">{item.position}</p>
        <h4 className="text-base font-semibold mt-2">{item.title}</h4>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-border"
          >
            <div className="flex justify-between items-center gap-8">
              <span className="text-xs text-muted-foreground">{item.startMonth}</span>
              <div className="flex-1 h-1 bg-gradient-to-r from-primary to-transparent" />
              <span className="text-xs text-muted-foreground">{item.endMonth}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function EducationCard({ item, index }: { item: typeof education[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="mb-4 border border-border rounded-2xl p-6 bg-foreground text-background cursor-pointer hover:opacity-90 transition-opacity"
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className="flex items-center justify-between">
        <span className="inline-block bg-background text-foreground text-xs font-bold px-3 py-1 rounded-full">
          {item.year}
        </span>
        <ChevronDown 
          className="w-5 h-5 transition-transform"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </div>
      <div className="mt-4">
        <p className="text-sm opacity-70">{item.school}</p>
        <h4 className="text-base font-semibold mt-2">{item.program}</h4>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="mt-4 pt-4 border-t border-background/30"
          >
            <p className="text-sm opacity-70">Certificate and credentials available upon request.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectItem({ title, index }: { title: string; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
        <ArrowDown className="w-6 h-6 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 rotate-45" />
      </div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={containerRef} className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background relative">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 p-6 md:p-10 flex justify-between items-center z-40 bg-white/80 backdrop-blur-md border-b border-border">
        <span className="font-display font-bold tracking-tight text-xl">ALEXANDER</span>
        <div className="flex gap-6 text-sm font-medium">
          <a href="#work" className="hover:opacity-70 transition-opacity">WORK</a>
          <a href="#about" className="hover:opacity-70 transition-opacity">ABOUT</a>
          <a href="#contact" className="hover:opacity-70 transition-opacity">CONTACT</a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen w-full flex flex-col justify-center px-6 md:px-12 pt-20 overflow-hidden">
        
        <div className="z-10">
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
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">Scroll</span>
          <ArrowDown className="w-4 h-4 text-muted-foreground animate-bounce" />
        </motion.div>
      </section>

      {/* About Section */}
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

      {/* Experience, Expertise, Education Section */}
      <section className="py-32 px-6 md:px-12 bg-secondary/5">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-display text-4xl md:text-5xl mb-20 font-light">My Background</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Experience */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display text-2xl mb-6">Experience</h3>
              <div className="space-y-4">
                {experience.map((item, i) => (
                  <ExperienceCard key={i} item={item} index={i} />
                ))}
              </div>
            </motion.div>

            {/* Expertise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <h3 className="font-display text-2xl mb-6">Expertise</h3>
              
              <div className="mb-8">
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Logo, Brand Identity, Packaging, Poster & Editorial, Social Media Post, 3D & Motion Graphic
                </p>
                <div className="h-px bg-border my-6" />
              </div>

              {/* Hardskill with Tech Badges */}
              <div className="mb-8">
                <h4 className="font-display text-xl mb-6">Hardskill</h4>
                <div className="bg-foreground text-background rounded-2xl p-6 mb-6">
                  <div className="aspect-square bg-gradient-to-br from-gray-700 to-black rounded-xl mb-4 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><circle cx=%2250%22 cy=%2250%22 r=%2245%22 fill=%22none%22 stroke=%22white%22/></svg>')]" />
                    {/* Skill badges in a circle */}
                    <div className="relative w-32 h-32">
                      {hardSkills.map((skill, i) => {
                        const angle = (i / hardSkills.length) * Math.PI * 2;
                        const x = Math.cos(angle) * 50;
                        const y = Math.sin(angle) * 50;
                        return (
                          <motion.div
                            key={skill.name}
                            className={`absolute w-10 h-10 rounded-full bg-gradient-to-br ${skill.color} flex items-center justify-center text-white text-xs font-bold`}
                            style={{
                              left: `calc(50% + ${x}px)`,
                              top: `calc(50% + ${y}px)`,
                              transform: "translate(-50%, -50%)"
                            }}
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                          >
                            {skill.name}
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Softskill */}
              <div>
                <h4 className="font-display text-xl mb-6">Softskill</h4>
                <div className="flex flex-wrap gap-3">
                  {softSkills.map((skill, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      viewport={{ once: true }}
                      className={`px-4 py-2 rounded-full text-sm font-medium border ${
                        skill.filled
                          ? "bg-primary text-background border-primary"
                          : "bg-background text-foreground border-border hover:border-foreground"
                      } transition-colors`}
                    >
                      {skill.label}
                    </motion.span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Education */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-display text-2xl mb-6">Education</h3>
              <div className="space-y-4">
                {education.map((item, i) => (
                  <EducationCard key={i} item={item} index={i} />
                ))}
              </div>
            </motion.div>

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
           
           <div className="flex flex-col relative z-10">
             {projects.map((project, i) => (
               <ProjectItem key={i} title={project.title} index={i} />
             ))}
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
