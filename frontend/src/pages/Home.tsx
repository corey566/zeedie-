import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, Globe, Github, Linkedin, ArrowRight, Server, Code, Users, Briefcase } from 'lucide-react';
import { Link } from 'wouter';
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
import ThreeScene, { FloatingShapes } from '@/components/ThreeScene';

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
      return <div className="text-black/40 dark:text-white/40">No contribution data available</div>;
    }

    // Group by weeks (max 26 weeks to fit layout)
    const weeks: any[] = [];
    let currentWeek: any[] = [];
    const limitedData = githubData.slice(-182); // Last ~26 weeks
    
    limitedData.forEach((day: any, index: number) => {
      currentWeek.push(day);
      if ((index + 1) % 7 === 0 || index === limitedData.length - 1) {
        weeks.push([...currentWeek]);
        currentWeek = [];
      }
    });

    const lightColors = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'];
    const darkColors = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];

    return (
      <div className="w-full overflow-x-auto">
        <div className="inline-flex gap-[3px] min-w-max">
          {weeks.map((week, w) => (
            <div key={w} className="flex flex-col gap-[3px]">
              {week.map((day: any, d: number) => (
                <div 
                  key={d} 
                  className="w-[10px] h-[10px] sm:w-[12px] sm:h-[12px] rounded-sm transition-colors"
                  style={{ 
                    backgroundColor: `var(--contrib-${day.level || 0})` 
                  }}
                  title={`${day.date}: ${day.count} contributions`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div 
      className="min-h-screen bg-[#f8f8f8] dark:bg-[#0a0a0a] text-black dark:text-white font-sans transition-colors duration-300" 
      ref={containerRef}
      style={{
        '--contrib-0': 'var(--tw-contrib-0, #ebedf0)',
        '--contrib-1': 'var(--tw-contrib-1, #9be9a8)',
        '--contrib-2': 'var(--tw-contrib-2, #40c463)',
        '--contrib-3': 'var(--tw-contrib-3, #30a14e)',
        '--contrib-4': 'var(--tw-contrib-4, #216e39)',
      } as React.CSSProperties}
    >
      
      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen px-3 sm:px-4 pt-24 sm:pt-28 pb-4 md:px-6 md:pb-6 gap-4 sm:gap-6 w-full max-w-full overflow-x-hidden">
        
        {/* Hero Card Frame */}
        <div className="relative w-full min-h-[70vh] sm:min-h-[80vh] md:h-[90vh] rounded-[1.5rem] sm:rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-black/5 dark:border-white/10 shadow-2xl bg-white dark:bg-[#111] isolate">
          
          {/* 3D Background */}
          <ThreeScene variant="hero" />

          {/* Internal Glass/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 dark:from-black/30 via-transparent to-black/5 dark:to-white/5 pointer-events-none" />

          {/* Top Corners Decor */}
          <div className="absolute top-4 sm:top-8 left-4 sm:left-8 text-black/40 dark:text-white/40 font-mono text-[10px] sm:text-xs uppercase tracking-wider">
            {siteConfig?.hero?.established || 'EST. 2021'}
          </div>
          <div className="absolute top-4 sm:top-8 right-4 sm:right-8 text-black/40 dark:text-white/40 font-mono text-[10px] sm:text-xs uppercase tracking-wider">
            {siteConfig?.hero?.version || 'PORTFOLIO V2'}
          </div>

          {/* Center/Main Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-center text-center z-20 pointer-events-none px-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex flex-col items-center"
            >
              <motion.span 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-xs sm:text-sm md:text-base font-mono uppercase tracking-[0.2em] sm:tracking-[0.3em] text-black/50 dark:text-white/50 mb-4 sm:mb-6"
              >
                {siteConfig?.hero?.description || 'IT Manager / Technical Operations Lead'}
              </motion.span>
              
              <h1 className="font-display text-[15vw] sm:text-[14vw] md:text-[12vw] leading-[0.85] tracking-tighter text-black dark:text-white font-black">
                {siteConfig?.hero?.title || 'TECH'}
              </h1>
              <h1 
                className="font-display text-[15vw] sm:text-[14vw] md:text-[12vw] leading-[0.85] tracking-tighter text-transparent font-black"
                style={{ WebkitTextStroke: '1px rgba(0,0,0,0.25)' }}
              >
                <span className="dark:hidden">{siteConfig?.hero?.subtitle || 'LEADER'}</span>
                <span className="hidden dark:inline" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.25)' }}>
                  {siteConfig?.hero?.subtitle || 'LEADER'}
                </span>
              </h1>
            </motion.div>
          </div>

          {/* Bottom Integrated Section */}
          <div className="absolute bottom-0 left-0 w-full flex flex-col md:flex-row items-end justify-between p-0 z-30">
            
            {/* Name Card with Curved Tab Effect */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="relative bg-black dark:bg-white text-white dark:text-black p-4 sm:p-6 md:p-10 rounded-tr-[2rem] sm:rounded-tr-[3rem] w-full md:w-auto md:min-w-[35%] flex flex-col gap-2"
            >
              {/* Inverted Corner Smoother */}
              <div className="absolute -top-[40px] left-0 w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#000] dark:shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
              
              <div className="flex flex-col gap-1 md:gap-3">
                <span className="font-mono text-[10px] sm:text-xs uppercase tracking-widest text-white/60 dark:text-black/60">
                  {siteConfig?.hero?.description || 'IT Manager / Technical Operations Lead'}
                </span>
                <h2 className="font-display text-xl sm:text-3xl md:text-5xl font-black uppercase tracking-tight">
                  {profile?.name || "Mohamed Yazeed Faumy"}
                </h2>
              </div>

              {/* Mobile CTA: Inside the name card */}
              <div className="mt-3 sm:mt-4 md:hidden">
                <Link href="/projects">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white dark:bg-black text-black dark:text-white px-4 sm:px-6 py-3 sm:py-4 rounded-full font-medium text-sm flex items-center justify-between group shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                    data-testid="hero-cta-mobile"
                  >
                    View My Work
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </motion.button>
                </Link>
              </div>

              {/* Inverted Corner Right Side */}
              <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#000] dark:shadow-[-20px_20px_0_0_#fff] rounded-bl-[20px] pointer-events-none hidden md:block" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="hidden md:flex flex-col items-center pb-12 animate-bounce absolute left-1/2 -translate-x-1/2 bottom-0 text-black dark:text-white"
            >
              <div className="w-[1px] h-12 bg-current"></div>
              <span className="text-xs font-mono mt-2 uppercase tracking-wider">Scroll</span>
            </motion.div>

            {/* Desktop CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="hidden md:flex p-6 md:p-10 w-full md:w-auto justify-end"
            >
              <Link href="/projects">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-full font-medium text-lg flex items-center gap-3 group shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                  data-testid="hero-cta-desktop"
                >
                  View My Work
                  <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                </motion.button>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Content Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6 w-full max-w-[1920px] mx-auto">
          
          {/* About / Intro Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8 bg-white dark:bg-[#111] p-6 sm:p-10 md:p-14 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10 min-h-[300px] sm:min-h-[400px] flex flex-col justify-between relative overflow-hidden"
          >
            <FloatingShapes />
            <div className="flex justify-between items-start mb-6 sm:mb-8 relative z-10">
              <span className="bg-black/5 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-black/5 dark:border-white/10">About</span>
              <Globe className="w-6 h-6 sm:w-8 sm:h-8 opacity-20" />
            </div>
            <h3 className="text-xl sm:text-3xl md:text-5xl font-display leading-tight relative z-10">
              Building <span className="text-black/40 dark:text-white/40">scalable infrastructure</span> and leading <span className="text-black/40 dark:text-white/40">high-performing teams</span> across global markets.
            </h3>
          </motion.div>

          {/* Stats / Quick Info - FIXED RESPONSIVE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-4 bg-black dark:bg-white text-white dark:text-black p-6 sm:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm flex flex-col justify-center gap-4 sm:gap-6 md:gap-8"
          >
            <div className="flex items-center gap-3 sm:gap-4">
              <h4 className="text-3xl sm:text-4xl md:text-6xl font-display font-black">{profile?.yearsExperience || 5}+</h4>
              <span className="text-white/60 dark:text-black/60 leading-tight text-xs sm:text-sm">Years of<br/>Experience</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <h4 className="text-3xl sm:text-4xl md:text-6xl font-display font-black">{profile?.projectsShipped || 50}+</h4>
              <span className="text-white/60 dark:text-black/60 leading-tight text-xs sm:text-sm">Projects<br/>Delivered</span>
            </div>
            <div className="flex items-center gap-3 sm:gap-4">
              <h4 className="text-3xl sm:text-4xl md:text-6xl font-display font-black">99.9%</h4>
              <span className="text-white/60 dark:text-black/60 leading-tight text-xs sm:text-sm">System<br/>Uptime</span>
            </div>
          </motion.div>

          {/* Expertise Cards - FIXED RESPONSIVE */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="col-span-1 md:col-span-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10"
          >
            <Server className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-blue-600 dark:text-blue-400" />
            <h4 className="font-display text-lg sm:text-xl font-bold mb-2">Cloud & DevOps</h4>
            <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">AWS, Linux VPS, CI/CD pipelines, Docker</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="col-span-1 md:col-span-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10"
          >
            <Code className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-green-600 dark:text-green-400" />
            <h4 className="font-display text-lg sm:text-xl font-bold mb-2">Backend & APIs</h4>
            <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">Python automation, API development</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 md:col-span-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10"
          >
            <Users className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-purple-600 dark:text-purple-400" />
            <h4 className="font-display text-lg sm:text-xl font-bold mb-2">Team Leadership</h4>
            <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">Cross-cultural teams, Agile/Scrum</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 md:col-span-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10"
          >
            <Briefcase className="w-8 h-8 sm:w-10 sm:h-10 mb-3 sm:mb-4 text-orange-600 dark:text-orange-400" />
            <h4 className="font-display text-lg sm:text-xl font-bold mb-2">Project Management</h4>
            <p className="text-black/60 dark:text-white/60 text-xs sm:text-sm">End-to-end delivery, budgeting</p>
          </motion.div>

          {/* GitHub Activity - FIXED LAYOUT */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 bg-white dark:bg-[#111] p-5 sm:p-10 md:p-14 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10"
          >
            <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
              <Github className="w-6 h-6 sm:w-8 sm:h-8" />
              <h2 className="text-xl sm:text-3xl md:text-4xl font-display">Contribution Activity</h2>
            </div>
            <ContributionGraph />
          </motion.div>

          {/* LinkedIn Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 bg-gradient-to-br from-[#0077b5]/5 to-[#0077b5]/10 dark:from-[#0077b5]/20 dark:to-[#0077b5]/10 border border-[#0077b5]/10 dark:border-[#0077b5]/30 p-5 sm:p-10 md:p-14 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
              <div className="flex items-center gap-3 sm:gap-4">
                <Linkedin className="w-6 h-6 sm:w-8 sm:h-8 text-[#0077b5]" />
                <h2 className="text-xl sm:text-3xl font-display">Recent Updates</h2>
              </div>
              <a href="https://linkedin.com/in/yazeedfaumy" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] font-medium hover:underline text-sm sm:text-base">View Profile</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {linkedinPosts.slice(0, 2).map((post: any) => (
                <div key={post.id} className="bg-white dark:bg-[#1a1a1a] p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-black/5 dark:border-white/10 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black dark:bg-white rounded-full flex items-center justify-center text-white dark:text-black font-bold text-xs sm:text-sm">MYF</div>
                    <div>
                      <p className="font-bold text-sm sm:text-base">{profile?.name || "Mohamed Yazeed Faumy"}</p>
                      <p className="text-[10px] sm:text-xs text-black/50 dark:text-white/50">{post.date}</p>
                    </div>
                  </div>
                  <p className="text-black/80 dark:text-white/80 mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">{post.content}</p>
                  <div className="flex gap-4 text-[10px] sm:text-xs text-black/50 dark:text-white/50 font-medium border-t border-black/5 dark:border-white/10 pt-3">
                    <span>{post.likes} Likes</span>
                    <span>{post.comments} Comments</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Recent Experience */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 bg-white dark:bg-[#111] p-5 sm:p-10 md:p-14 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10 relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 sm:gap-6 mb-8 sm:mb-12 relative z-10">
              <div>
                <span className="bg-black/5 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-black/5 dark:border-white/10 mb-3 sm:mb-4 inline-block">Career</span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-display">Work Experience</h2>
              </div>
              <Link href="/experience">
                <button className="flex items-center gap-2 text-sm sm:text-lg hover:opacity-60 transition-opacity" data-testid="link-experience">
                  Full Resume <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5"/>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 relative z-10">
              {experience.slice(0, 4).map((job: any, i: number) => (
                <motion.div 
                  key={job.id || i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group border-l-4 border-black/10 dark:border-white/20 pl-4 sm:pl-6 hover:border-black dark:hover:border-white transition-colors"
                >
                  <span className="text-xs sm:text-sm text-black/50 dark:text-white/50 block mb-2 font-mono">{job.period}</span>
                  <h4 className="text-base sm:text-xl font-bold mb-1">{job.role}</h4>
                  <p className="text-sm sm:text-lg text-black/70 dark:text-white/70 mb-3 sm:mb-4">{job.company} {job.location && `• ${job.location}`}</p>
                  <ul className="text-black/60 dark:text-white/60 leading-relaxed text-xs sm:text-sm space-y-1">
                    {job.highlights.slice(0, 2).map((h: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-black/30 dark:text-white/30 mt-1">•</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Selected Projects */}
          <div className="md:col-span-12">
            <div className="flex items-center justify-between mb-6 sm:mb-8 px-2 sm:px-4">
              <h2 className="text-xl sm:text-3xl font-display">Featured Projects</h2>
              <Link href="/projects">
                <button className="flex items-center gap-2 text-sm sm:text-base hover:opacity-60 transition-opacity" data-testid="link-projects">View All <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4"/></button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {projects.slice(0, 4).map((project: any, i: number) => (
                <Link key={project.id || i} href={`/projects/${project.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className={`${project.color || 'bg-gray-50 dark:bg-gray-900'} group p-6 sm:p-10 md:p-12 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm border border-black/5 dark:border-white/10 min-h-[280px] sm:min-h-[350px] flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all`}
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className="w-full flex justify-end">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-black/5 dark:bg-white/10 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white dark:group-hover:bg-white dark:group-hover:text-black transition-colors">
                        <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-black/50 dark:text-white/50 font-medium mb-2 block text-xs sm:text-sm">Featured Project</span>
                      <h3 className="text-xl sm:text-3xl md:text-4xl font-display font-bold">{project.title}</h3>
                      <p className="mt-3 sm:mt-4 text-black/60 dark:text-white/60 leading-relaxed text-sm sm:text-base">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-3 sm:mt-4">
                        {(project.technologies || []).slice(0, 3).map((tech: string, j: number) => (
                          <span key={j} className="px-2 sm:px-3 py-1 bg-white/60 dark:bg-black/30 rounded-full text-[10px] sm:text-xs font-medium">{tech}</span>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </div>

          {/* Blog / Insights */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 bg-white dark:bg-[#111] border border-black/5 dark:border-white/10 p-5 sm:p-10 md:p-14 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-sm flex flex-col"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 sm:mb-8">
              <div>
                <span className="bg-black/5 dark:bg-white/10 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border border-black/5 dark:border-white/10 mb-3 sm:mb-4 inline-block">Journal</span>
                <h2 className="text-xl sm:text-3xl font-display">Latest Insights</h2>
              </div>
              <Link href="/blog">
                <button className="text-black dark:text-white font-medium hover:opacity-60 transition-opacity text-sm sm:text-base" data-testid="link-blog">Read all articles &rarr;</button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {blogs.slice(0, 3).map((post: any, i: number) => (
                <Link key={post.id || i} href={`/blog/${post.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer p-4 sm:p-6 rounded-xl sm:rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    data-testid={`blog-card-${post.id}`}
                  >
                    <span className="text-[10px] sm:text-sm text-black/40 dark:text-white/40 mb-2 block">
                      {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                    <h4 className="text-base sm:text-xl font-bold group-hover:text-black/70 dark:group-hover:text-white/70 transition-colors mb-2">{post.title}</h4>
                    <p className="text-xs sm:text-sm text-black/50 dark:text-white/50">{post.excerpt}</p>
                    <div className="flex gap-2 mt-3 sm:mt-4">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-[10px] sm:text-xs bg-black/5 dark:bg-white/10 px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="mt-12 sm:mt-20 md:mt-32 mb-6 sm:mb-10 max-w-7xl mx-auto w-full text-center">
          <h2 className="font-display text-[12vw] sm:text-[10vw] leading-none tracking-tight text-black/10 dark:text-white/10 select-none font-black">
            YAZEED
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm font-medium opacity-60">
            <span>&copy; 2025 Mohamed Yazeed Faumy</span>
            <span className="hidden md:inline">&bull;</span>
            <div className="flex gap-4 sm:gap-6">
              <a href="mailto:2002yazeedfaumy@gmail.com" className="hover:text-black dark:hover:text-white transition-colors">Email</a>
              <a href="https://linkedin.com/in/yazeedfaumy" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">LinkedIn</a>
              <a href="https://github.com/yazeedfaumy" target="_blank" rel="noopener noreferrer" className="hover:text-black dark:hover:text-white transition-colors">GitHub</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
