import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Copy, Menu } from 'lucide-react';
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
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px] mix-blend-overlay z-10" />
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="w-full h-full object-cover filter grayscale contrast-125 brightness-110"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
        {/* Grain overlay for texture */}
        <div className="absolute inset-0 opacity-[0.03] z-20" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
      </div>

      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 py-4 md:px-6 md:py-6">
        
        {/* Hero Card Frame */}
        <div className="relative w-full h-[85vh] md:h-[90vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-[6px] border-white shadow-2xl bg-transparent isolate">
          
          {/* Internal Glass/Gradient Overlay to ensure text readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-black/20 pointer-events-none" />

          {/* Top Navigation Bar inside the frame */}
          <div className="absolute top-0 left-0 right-0 p-8 md:p-10 flex justify-between items-start z-30 mix-blend-difference text-white">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-full">
              <span className="text-3xl font-display leading-none">*</span>
            </div>
            
            <nav className="flex items-center gap-6 md:gap-8">
              {['Work', 'About', 'Contact'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="text-lg font-medium hover:opacity-70 transition-opacity">
                  {item}
                </a>
              ))}
            </nav>
          </div>

          {/* Center/Main Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 pointer-events-none">
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter text-white mix-blend-difference"
            >
              CREATIVE
            </motion.h1>
            <motion.h1 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-display text-[15vw] md:text-[12vw] leading-[0.8] tracking-tighter text-transparent stroke-white"
              style={{ WebkitTextStroke: '2px white' }}
            >
              ENGINEER
            </motion.h1>
          </div>

          {/* Bottom Integrated "Tab" Section */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col md:flex-row items-end justify-between p-0 z-30">
            
            {/* The "Tab" - Bottom Left Name Card */}
            <div className="relative bg-white text-black p-8 md:p-12 rounded-tr-[3rem] w-full md:w-auto min-w-[40%]">
              {/* Inverted Corner Smoother (Optional visual trick) */}
              <div className="absolute -top-[40px] left-0 w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
              
              <div className="flex flex-col gap-4">
                <span className="font-mono text-xs uppercase tracking-widest opacity-60">
                  Full Stack Developer
                </span>
                <h2 className="font-display text-4xl md:text-5xl font-black uppercase tracking-tight">
                  Ourelio<br/>Koumedzro
                </h2>
              </div>

              {/* Inverted Corner Right Side */}
              <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
            </div>

            {/* Bottom Right - Action Button */}
            <div className="p-8 md:p-10 w-full md:w-auto flex justify-end">
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-black px-8 py-4 rounded-full font-medium text-lg flex items-center gap-2 group shadow-lg hover:shadow-xl transition-all"
              >
                View Selected Work
                <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Overlapping Content Section below */}
        <div className="relative w-full max-w-7xl mx-auto -mt-20 md:-mt-32 z-20 px-4 md:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
            
            {/* Card 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#1a1a1a] text-white p-10 md:p-14 rounded-[2.5rem] shadow-xl flex flex-col justify-between min-h-[400px] hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex justify-between items-start">
                <span className="bg-white/10 px-4 py-2 rounded-full text-sm backdrop-blur-md border border-white/10">About</span>
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-xl">01</span>
                </div>
              </div>
              <div>
                <h3 className="text-3xl md:text-4xl font-display mb-4">Building Digital<br/>Experiences</h3>
                <p className="text-white/60 leading-relaxed max-w-sm">
                  I craft minimal, robust, and scalable solutions that solve real business problems. No fluff, just code.
                </p>
              </div>
            </motion.div>

            {/* Card 2 - Offset */}
            <motion.div 
              initial={{ opacity: 0, y: 100 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white text-black p-10 md:p-14 rounded-[2.5rem] shadow-xl flex flex-col justify-between min-h-[400px] mt-0 md:mt-24 hover:-translate-y-2 transition-transform duration-500"
            >
              <div className="flex justify-between items-start">
                <span className="bg-black/5 px-4 py-2 rounded-full text-sm border border-black/5">Services</span>
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold">02</span>
                </div>
              </div>
              <div className="space-y-6">
                <div className="border-b border-black/10 pb-4">
                  <h4 className="text-xl font-medium flex justify-between">Frontend Development <ArrowUpRight className="opacity-0 group-hover:opacity-100"/></h4>
                </div>
                <div className="border-b border-black/10 pb-4">
                  <h4 className="text-xl font-medium">UI/UX Design</h4>
                </div>
                <div className="border-b border-black/10 pb-4">
                  <h4 className="text-xl font-medium">System Architecture</h4>
                </div>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Footer/Contact Area */}
        <footer className="mt-20 md:mt-40 mb-10 max-w-7xl mx-auto w-full text-center">
           <h2 className="font-display text-[8vw] leading-none tracking-tight mix-blend-difference text-black opacity-80">
            LET'S TALK
          </h2>
          <div className="flex justify-center gap-4 mt-8">
            <button className="bg-black text-white px-8 py-4 rounded-full font-medium hover:scale-105 transition-transform">
              Email Me
            </button>
            <button className="bg-white text-black border border-black/10 px-8 py-4 rounded-full font-medium hover:bg-black/5 transition-colors flex items-center gap-2">
              <Copy className="w-4 h-4" /> Copy Email
            </button>
          </div>
        </footer>

      </div>
    </div>
  );
}
