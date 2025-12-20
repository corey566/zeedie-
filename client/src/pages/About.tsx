import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import stockImage from '@assets/stock_images/professional_develop_ccee3624.jpg';

export default function About() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.from(sectionRef.current.querySelectorAll('.fade-in'), {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
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
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8"
        >
          <div className="md:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm flex flex-col justify-center">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full w-fit">About Me</span>
            <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.9] tracking-tighter">
              Full-Stack Engineer with a Focus on <span className="text-black/40">Enterprise Solutions</span>
            </h1>
          </div>
          
          <div className="md:col-span-4 bg-white p-2 rounded-[2.5rem] shadow-sm h-[400px] md:h-auto overflow-hidden relative">
             <img src={stockImage} alt="Profile" className="w-full h-full object-cover rounded-[2rem] filter grayscale hover:grayscale-0 transition-all duration-500" />
          </div>
        </motion.div>

        <div ref={sectionRef} className="space-y-6">
          <motion.div className="fade-in p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
            <h3 className="font-display text-3xl mb-6">The Journey</h3>
            <p className="text-xl text-black/60 leading-relaxed font-light">
              My university experience focused heavily on syllabus completion rather than practical, industry-ready knowledge. While fundamentals were repeatedly taught, real-world application was limited. In 2020, I began my professional journey as a freelance developer, delivering my first production website using HTML, CSS, and JavaScript. This marked the start of continuous self-driven learning.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div className="fade-in p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <h3 className="font-display text-2xl mb-4">Technical Evolution</h3>
              <p className="text-lg text-black/60 leading-relaxed">
                Inspired by the rise of AI, I built object recognition applications using Python and OpenCV, then expanded into React, Node.js, MERN-based projects, and Laravel-based enterprise systems. Over time, I specialized in building ERP platforms, geolocation systems, HR tracking tools, and SaaS applications.
              </p>
            </motion.div>

            <motion.div className="fade-in p-8 md:p-12 bg-black text-white rounded-[2.5rem] shadow-sm hover:shadow-md transition-all">
              <h3 className="font-display text-2xl mb-4">Current Focus</h3>
              <p className="text-lg text-white/70 leading-relaxed">
                Today, I deliver measurable business value across multiple industries. From web scrapers that generate leads, to ERP systems processing millions in transactions, to automation workflows saving hours of manual work — every project is built with attention to performance, scalability, and user experience.
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: 'Languages', value: 'PHP, JavaScript, Python, Laravel' },
              { label: 'Specialties', value: 'ERP, SaaS, CRM, Automation' },
              { label: 'Industries', value: 'SaaS, Finance, Logistics, Printing' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="fade-in p-8 bg-white rounded-[2rem] shadow-sm hover:bg-black hover:text-white transition-all group"
              >
                <p className="text-sm font-mono uppercase tracking-widest opacity-50 mb-4">{item.label}</p>
                <p className="text-xl font-display leading-tight">{item.value}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
