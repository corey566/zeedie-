import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Copy, ArrowRight, Code, Database, Globe } from 'lucide-react';
import { Link } from 'wouter';
import videoSrc from '@assets/generated_videos/slow_motion_abstract_liquid_grayscale.mp4';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans selection:bg-black selection:text-white" ref={containerRef}>
      
      {/* Background Video Layer */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[1px] mix-blend-overlay z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-110 opacity-60"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Grain overlay for texture */}
        <div className="absolute inset-0 opacity-[0.05] z-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 pt-28 pb-4 md:px-6 md:pb-6 gap-6">
        
        {/* Hero Card Frame */}
        <div className="relative w-full h-[85vh] md:h-[90vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-[4px] border-white/50 shadow-2xl bg-white/10 backdrop-blur-sm isolate">
          
          {/* Internal Glass/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

          {/* Top Corners Decor */}
          <div className="absolute top-8 left-8 text-black/40 font-mono text-sm">EST. 2024</div>
          <div className="absolute top-8 right-8 text-black/40 font-mono text-sm">PORTFOLIO V1</div>

          {/* Center/Main Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
               <h1 className="font-display text-[12vw] md:text-[13vw] leading-[0.85] tracking-tighter text-black mix-blend-overlay opacity-90">
                CREATIVE
              </h1>
              <h1 className="font-display text-[12vw] md:text-[13vw] leading-[0.85] tracking-tighter text-transparent stroke-black/80" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.8)' }}>
                ENGINEER
              </h1>
            </motion.div>
          </div>

          {/* Bottom Integrated Section */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col md:flex-row items-end justify-between p-0 z-30">
            
            {/* Name Card with Curved Tab Effect */}
            <div className="relative bg-white text-black p-6 md:p-10 rounded-tr-[3rem] w-full md:w-auto min-w-[35%] shadow-[0_-20px_40px_rgba(0,0,0,0.1)] flex flex-col gap-2">
              {/* Inverted Corner Smoother */}
              <div className="absolute -top-[40px] left-0 w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
              
              <div className="flex flex-col gap-1 md:gap-3">
                <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                  Full Stack Developer
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight">
                  ZEE DIE
                </h2>
              </div>

              {/* Inverted Corner Right Side */}
              <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
            </div>

            {/* Scroll Indicator */}
             <div className="hidden md:flex flex-col items-center pb-12 opacity-50 animate-bounce absolute left-1/2 -translate-x-1/2 bottom-0">
                <div className="w-[1px] h-12 bg-black"></div>
                <span className="text-xs font-mono mt-2">SCROLL</span>
             </div>

            {/* CTA Button */}
            <div className="p-6 md:p-10 w-full md:w-auto flex justify-end bg-gradient-to-t from-black/20 to-transparent md:bg-none">
              <Link href="/projects">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-medium text-sm md:text-lg flex items-center gap-2 group shadow-xl hover:shadow-2xl transition-all cursor-pointer whitespace-nowrap"
                >
                  View Selected Work
                  <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 group-hover:rotate-45 transition-transform" />
                </motion.button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-[1920px] mx-auto">
          
          {/* About / Intro Section */}
          <div className="md:col-span-8 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col justify-between">
             <div className="flex justify-between items-start mb-8">
                <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5">About</span>
                <Globe className="w-8 h-8 opacity-20" />
              </div>
              <h3 className="text-3xl md:text-5xl font-display leading-tight">
                Crafting digital experiences that merge <span className="text-black/40">artistic vision</span> with <span className="text-black/40">engineering precision</span>.
              </h3>
          </div>

          {/* Stats / Quick Info */}
          <div className="md:col-span-4 bg-[#1a1a1a] text-white p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-center gap-8">
              <div className="flex items-center gap-4">
                 <h4 className="text-6xl font-display">5+</h4>
                 <span className="text-white/60 leading-tight">Years of<br/>Experience</span>
              </div>
               <div className="flex items-center gap-4">
                 <h4 className="text-6xl font-display">50+</h4>
                 <span className="text-white/60 leading-tight">Projects<br/>Shipped</span>
              </div>
          </div>

          {/* Recent Experience */}
          <div className="md:col-span-12 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm">
             <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                <div>
                   <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5 mb-4 inline-block">Career</span>
                   <h2 className="text-4xl md:text-5xl font-display">Recent Experience</h2>
                </div>
                <Link href="/experience">
                   <button className="flex items-center gap-2 text-lg hover:opacity-60 transition-opacity">Full Resume <ArrowRight className="w-5 h-5"/></button>
                </Link>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { role: "Senior Frontend Engineer", company: "TechFlow", period: "2023 - Present", desc: "Leading frontend architecture for enterprise SaaS products." },
                  { role: "Full Stack Developer", company: "InnovateLabs", period: "2021 - 2023", desc: "Built scalable web applications using React and Node.js." },
                  { role: "UI/UX Developer", company: "Creative Studio", period: "2019 - 2021", desc: "Designed and implemented award-winning web interfaces." }
                ].map((job, i) => (
                  <div key={i} className="group border-t border-black/10 pt-8 hover:bg-black/5 rounded-xl p-4 transition-colors">
                     <span className="text-sm text-black/50 block mb-2">{job.period}</span>
                     <h4 className="text-xl font-bold mb-1">{job.role}</h4>
                     <p className="text-lg text-black/70 mb-4">{job.company}</p>
                     <p className="text-black/60 leading-relaxed">{job.desc}</p>
                  </div>
                ))}
             </div>
          </div>

          {/* Selected Projects */}
          <div className="md:col-span-12">
             <div className="flex items-center justify-between mb-8 px-4">
                <h2 className="text-3xl font-display">Selected Works</h2>
                <Link href="/projects">
                   <button className="flex items-center gap-2 hover:opacity-60 transition-opacity">View All <ArrowRight className="w-4 h-4"/></button>
                </Link>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { title: "E-Commerce Dashboard", cat: "SaaS Product", color: "bg-blue-50" },
                  { title: "FinTech Mobile App", cat: "Mobile Design", color: "bg-green-50" },
                  { title: "AI Content Generator", cat: "Web Application", color: "bg-purple-50" },
                  { title: "Architecture Portfolio", cat: "Web Design", color: "bg-orange-50" }
                ].map((project, i) => (
                   <Link key={i} href="/projects">
                     <div className={`${project.color} group p-10 md:p-14 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-y-1`}>
                        <div className="w-full flex justify-end">
                           <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                              <ArrowUpRight className="w-5 h-5" />
                           </div>
                        </div>
                        <div>
                           <span className="text-black/50 font-medium mb-2 block">{project.cat}</span>
                           <h3 className="text-3xl md:text-4xl font-display">{project.title}</h3>
                        </div>
                     </div>
                   </Link>
                ))}
             </div>
          </div>

          {/* Skills Summary */}
          <div className="md:col-span-6 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm">
             <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5 mb-8 inline-block">Expertise</span>
             <h2 className="text-3xl font-display mb-8">Technical Arsenal</h2>
             
             <div className="flex flex-wrap gap-3">
                {['React', 'TypeScript', 'Next.js', 'Node.js', 'Tailwind CSS', 'Framer Motion', 'PostgreSQL', 'GraphQL', 'AWS', 'Figma'].map((skill) => (
                  <span key={skill} className="px-5 py-3 rounded-xl border border-black/10 text-lg hover:bg-black hover:text-white transition-colors cursor-default">
                    {skill}
                  </span>
                ))}
             </div>
          </div>

          {/* Blog / Insights */}
          <div className="md:col-span-6 bg-[#f7f7f7] border border-white p-10 md:p-14 rounded-[2.5rem] shadow-sm flex flex-col">
             <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5 mb-8 inline-block w-fit">Journal</span>
             <h2 className="text-3xl font-display mb-8">Latest Thoughts</h2>
             
             <div className="flex flex-col gap-6">
                {[
                  { title: "The Future of Frontend Architecture", date: "Dec 12, 2024" },
                  { title: "Mastering Framer Motion Animations", date: "Nov 28, 2024" },
                  { title: "Why Minimalism Matters in UI", date: "Nov 15, 2024" }
                ].map((post, i) => (
                   <div key={i} className="group cursor-pointer">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="text-xl font-bold group-hover:text-black/60 transition-colors">{post.title}</h4>
                        <span className="text-sm text-black/40 whitespace-nowrap ml-4">{post.date}</span>
                      </div>
                      <div className="h-[1px] w-full bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                   </div>
                ))}
             </div>
             <div className="mt-auto pt-8">
               <button className="text-black font-medium hover:opacity-60 transition-opacity">Read all articles &rarr;</button>
             </div>
          </div>

        </div>

        {/* Footer */}
        <footer className="mt-20 md:mt-32 mb-10 max-w-7xl mx-auto w-full text-center">
           <h2 className="font-display text-[10vw] leading-none tracking-tight text-black/10 select-none">
            ZEE DIE
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-sm font-medium opacity-60">
            <span>&copy; 2025 Zee Die Portfolio</span>
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
