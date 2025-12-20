import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Globe, Github, Linkedin, ArrowRight } from 'lucide-react';
import { Link } from 'wouter';
import videoSrc from '@assets/generated_videos/slow_motion_abstract_liquid_grayscale.mp4';
import { useQuery } from '@tanstack/react-query';
import { 
  fetchProfile, 
  fetchFeaturedProjects, 
  fetchBlogPosts, 
  fetchExperience, 
  fetchLinkedinPosts,
  fetchGithubContributions,
  fetchSiteConfig
} from '@/lib/api';

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Fetch data from backend
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const { data: projects = [] } = useQuery({ queryKey: ['featured-projects'], queryFn: fetchFeaturedProjects });
  const { data: blogs = [] } = useQuery({ queryKey: ['blog-posts'], queryFn: fetchBlogPosts });
  const { data: experience = [] } = useQuery({ queryKey: ['experience'], queryFn: fetchExperience });
  const { data: linkedinPosts = [] } = useQuery({ queryKey: ['linkedin-posts'], queryFn: fetchLinkedinPosts });
  const { data: githubData = [] } = useQuery({ queryKey: ['github-contributions'], queryFn: fetchGithubContributions });
  const { data: siteConfig } = useQuery({ queryKey: ['site-config'], queryFn: fetchSiteConfig });

  // GitHub Contribution Graph Component
  const ContributionGraph = () => {
    if (!githubData.length) {
      return <div className="text-black/40">No contribution data available</div>;
    }

    // Group by weeks
    const weeks: any[] = [];
    let currentWeek: any[] = [];
    
    githubData.forEach((day: any, index: number) => {
      currentWeek.push(day);
      if ((index + 1) % 7 === 0 || index === githubData.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    const colors = ['bg-gray-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500'];

    return (
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-1">
            {week.map((day: any, d: number) => (
              <div 
                key={d} 
                className={`w-3 h-3 rounded-sm ${colors[day.level] || colors[0]}`} 
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

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
      <div className="relative z-10 flex flex-col min-h-screen px-4 pt-28 pb-4 md:px-6 md:pb-6 gap-6 w-full max-w-full overflow-x-hidden">
        
        {/* Hero Card Frame */}
        <div className="relative w-full h-[85vh] md:h-[90vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border-[4px] border-white/50 shadow-2xl bg-white/10 backdrop-blur-sm isolate">
          
          {/* Internal Glass/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/10 pointer-events-none" />

          {/* Top Corners Decor */}
          <div className="absolute top-8 left-8 text-black/40 font-mono text-sm">{siteConfig?.hero?.established || 'EST. 2024'}</div>
          <div className="absolute top-8 right-8 text-black/40 font-mono text-sm">{siteConfig?.hero?.version || 'PORTFOLIO V1'}</div>

          {/* Center/Main Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
               <h1 className="font-display text-[12vw] md:text-[13vw] leading-[0.85] tracking-tighter text-black mix-blend-overlay opacity-90">
                {siteConfig?.hero?.title || 'CREATIVE'}
              </h1>
              <h1 className="font-display text-[12vw] md:text-[13vw] leading-[0.85] tracking-tighter text-transparent stroke-black/80" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.8)' }}>
                {siteConfig?.hero?.subtitle || 'ENGINEER'}
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
                  {siteConfig?.hero?.description || 'Full Stack Developer'}
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight">
                  {profile?.name || "ZEEDIE"}
                </h2>
              </div>

               {/* Mobile CTA: Inside the name card */}
               <div className="mt-4 md:hidden">
                <Link href="/projects">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-black text-white px-6 py-4 rounded-full font-medium text-sm flex items-center justify-between group shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                  >
                    View Selected Work
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </motion.button>
                </Link>
              </div>

              {/* Inverted Corner Right Side */}
              <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
            </div>

            {/* Scroll Indicator */}
             <div className="hidden md:flex flex-col items-center pb-12 opacity-50 animate-bounce absolute left-1/2 -translate-x-1/2 bottom-0">
                <div className="w-[1px] h-12 bg-black"></div>
                <span className="text-xs font-mono mt-2">SCROLL</span>
             </div>

            {/* Desktop CTA Button */}
            <div className="hidden md:flex p-6 md:p-10 w-full md:w-auto justify-end bg-gradient-to-t from-black/20 to-transparent md:bg-none">
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
                 <h4 className="text-6xl font-display">{profile?.yearsExperience || 5}+</h4>
                 <span className="text-white/60 leading-tight">Years of<br/>Experience</span>
              </div>
               <div className="flex items-center gap-4">
                 <h4 className="text-6xl font-display">{profile?.projectsShipped || 50}+</h4>
                 <span className="text-white/60 leading-tight">Projects<br/>Shipped</span>
              </div>
          </div>

          {/* GitHub Activity - NEW SECTION */}
          <div className="md:col-span-12 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm overflow-hidden">
             <div className="flex items-center gap-4 mb-8">
                <Github className="w-8 h-8" />
                <h2 className="text-3xl md:text-4xl font-display">Open Source Contributions</h2>
             </div>
             <div className="w-full overflow-x-auto pb-4">
                <div className="min-w-[800px]">
                  <ContributionGraph />
                </div>
             </div>
          </div>

          {/* LinkedIn Feed - NEW SECTION */}
          <div className="md:col-span-12 bg-[#0077b5]/5 border border-[#0077b5]/10 p-10 md:p-14 rounded-[2.5rem] shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <Linkedin className="w-8 h-8 text-[#0077b5]" />
                  <h2 className="text-3xl font-display">Recent Updates</h2>
                </div>
                <a href="https://linkedin.com" target="_blank" className="text-[#0077b5] font-medium hover:underline">View Profile</a>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {linkedinPosts.slice(0, 2).map((post: any) => (
                  <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white font-bold text-xs">ZD</div>
                      <div>
                        <p className="font-bold text-sm">{profile?.name || "ZEEDIE"}</p>
                        <p className="text-xs text-gray-500">{post.date}</p>
                      </div>
                    </div>
                    <p className="text-gray-800 mb-4">{post.content}</p>
                    <div className="flex gap-4 text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
                      <span>{post.likes} Likes</span>
                      <span>{post.comments} Comments</span>
                    </div>
                  </div>
                ))}
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
                {experience.slice(0, 3).map((job: any, i: number) => (
                  <div key={job.id || i} className="group border-t border-black/10 pt-8 hover:bg-black/5 rounded-xl p-4 transition-colors">
                     <span className="text-sm text-black/50 block mb-2">{job.period}</span>
                     <h4 className="text-xl font-bold mb-1">{job.role}</h4>
                     <p className="text-lg text-black/70 mb-4">{job.company}</p>
                     <ul className="list-disc list-inside text-black/60 leading-relaxed text-sm">
                        {job.highlights.slice(0, 2).map((h: string, idx: number) => (
                          <li key={idx} className="mb-1">{h}</li>
                        ))}
                     </ul>
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
                {projects.slice(0, 2).map((project: any, i: number) => (
                   <Link key={project.id || i} href="/projects">
                     <div className={`${project.color} group p-10 md:p-14 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col justify-between cursor-pointer hover:shadow-md transition-all hover:-translate-y-1`}>
                        <div className="w-full flex justify-end">
                           <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                              <ArrowUpRight className="w-5 h-5" />
                           </div>
                        </div>
                        <div>
                           <span className="text-black/50 font-medium mb-2 block">Featured Project</span>
                           <h3 className="text-3xl md:text-4xl font-display">{project.title}</h3>
                           <p className="mt-4 text-black/60">{project.description}</p>
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
                {blogs.slice(0, 3).map((post: any, i: number) => (
                   <Link key={post.id || i} href={`/blog/${post.id}`}>
                     <div className="group cursor-pointer">
                        <div className="flex justify-between items-baseline mb-2">
                          <h4 className="text-xl font-bold group-hover:text-black/60 transition-colors">{post.title}</h4>
                          <span className="text-sm text-black/40 whitespace-nowrap ml-4">
                            {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                        </div>
                        <p className="text-sm text-black/50 mb-2">{post.excerpt}</p>
                        <div className="h-[1px] w-full bg-black/10 group-hover:bg-black/30 transition-colors"></div>
                     </div>
                   </Link>
                ))}
             </div>
             <div className="mt-auto pt-8">
               <Link href="/blog">
                 <button className="text-black font-medium hover:opacity-60 transition-opacity">Read all articles &rarr;</button>
               </Link>
             </div>
          </div>

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
