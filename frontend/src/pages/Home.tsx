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

    const colors = ['bg-gray-200 dark:bg-gray-700', 'bg-emerald-200 dark:bg-emerald-800', 'bg-emerald-300 dark:bg-emerald-700', 'bg-emerald-400 dark:bg-emerald-600', 'bg-emerald-500 dark:bg-emerald-500'];

    return (
      <div className="flex gap-1 overflow-x-auto pb-2">
        {weeks.map((week, w) => (
          <div key={w} className="flex flex-col gap-1">
            {week.map((day: any, d: number) => (
              <div 
                key={d} 
                className={`w-3 h-3 rounded-sm ${colors[day.level] || colors[0]} transition-colors hover:ring-2 hover:ring-black/20`} 
                title={`${day.date}: ${day.count} contributions`}
              />
            ))}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] dark:bg-[#0a0a0a] text-foreground font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black" ref={containerRef}>
      
      {/* Main Content Wrapper */}
      <div className="relative z-10 flex flex-col min-h-screen px-4 pt-28 pb-4 md:px-6 md:pb-6 gap-6 w-full max-w-full overflow-x-hidden">
        
        {/* Hero Card Frame */}
        <div className="relative w-full h-[85vh] md:h-[90vh] rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl bg-white dark:bg-[#111] isolate">
          
          {/* 3D Background */}
          <ThreeScene variant="hero" />

          {/* Internal Glass/Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-black/5 pointer-events-none" />

          {/* Top Corners Decor */}
          <div className="absolute top-8 left-8 text-black/40 font-mono text-xs uppercase tracking-wider">{siteConfig?.hero?.established || 'EST. 2021'}</div>
          <div className="absolute top-8 right-8 text-black/40 font-mono text-xs uppercase tracking-wider">{siteConfig?.hero?.version || 'PORTFOLIO V2'}</div>

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
                className="text-sm md:text-base font-mono uppercase tracking-[0.3em] text-black/50 mb-6"
              >
                {siteConfig?.hero?.description || 'IT Manager / Technical Operations Lead'}
              </motion.span>
              
              <h1 className="font-display text-[14vw] md:text-[12vw] leading-[0.85] tracking-tighter text-black font-black">
                {siteConfig?.hero?.title || 'TECH'}
              </h1>
              <h1 className="font-display text-[14vw] md:text-[12vw] leading-[0.85] tracking-tighter text-transparent font-black" style={{ WebkitTextStroke: '2px rgba(0,0,0,0.25)' }}>
                {siteConfig?.hero?.subtitle || 'LEADER'}
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
              className="relative bg-black text-white p-6 md:p-10 rounded-tr-[3rem] w-full md:w-auto min-w-[35%] flex flex-col gap-2"
            >
              {/* Inverted Corner Smoother */}
              <div className="absolute -top-[40px] left-0 w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#000] rounded-bl-[20px] pointer-events-none hidden md:block" />
              
              <div className="flex flex-col gap-1 md:gap-3">
                <span className="font-mono text-xs uppercase tracking-widest text-white/60">
                  {siteConfig?.hero?.description || 'IT Manager / Technical Operations Lead'}
                </span>
                <h2 className="font-display text-3xl md:text-5xl font-black uppercase tracking-tight">
                  {profile?.name || "Mohamed Yazeed Faumy"}
                </h2>
              </div>

              {/* Mobile CTA: Inside the name card */}
              <div className="mt-4 md:hidden">
                <Link href="/projects">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full bg-white text-black px-6 py-4 rounded-full font-medium text-sm flex items-center justify-between group shadow-xl hover:shadow-2xl transition-all cursor-pointer"
                    data-testid="hero-cta-mobile"
                  >
                    View My Work
                    <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
                  </motion.button>
                </Link>
              </div>

              {/* Inverted Corner Right Side */}
              <div className="absolute bottom-0 -right-[40px] w-[40px] h-[40px] bg-transparent shadow-[-20px_20px_0_0_#000] rounded-bl-[20px] pointer-events-none hidden md:block" />
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1, duration: 0.8 }}
              className="hidden md:flex flex-col items-center pb-12 animate-bounce absolute left-1/2 -translate-x-1/2 bottom-0"
            >
              <div className="w-[1px] h-12 bg-black"></div>
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
                  className="bg-black text-white px-8 py-4 rounded-full font-medium text-lg flex items-center gap-3 group shadow-xl hover:shadow-2xl transition-all cursor-pointer"
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
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 w-full max-w-[1920px] mx-auto">
          
          {/* About / Intro Section */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-8 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm min-h-[400px] flex flex-col justify-between relative overflow-hidden"
          >
            <FloatingShapes />
            <div className="flex justify-between items-start mb-8 relative z-10">
              <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5">About</span>
              <Globe className="w-8 h-8 opacity-20" />
            </div>
            <h3 className="text-3xl md:text-5xl font-display leading-tight relative z-10">
              Building <span className="text-black/40">scalable infrastructure</span> and leading <span className="text-black/40">high-performing teams</span> across global markets.
            </h3>
          </motion.div>

          {/* Stats / Quick Info */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-4 bg-black text-white p-10 rounded-[2.5rem] shadow-sm flex flex-col justify-center gap-8"
          >
            <div className="flex items-center gap-4">
              <h4 className="text-6xl font-display font-black">{profile?.yearsExperience || 5}+</h4>
              <span className="text-white/60 leading-tight">Years of<br/>Experience</span>
            </div>
            <div className="flex items-center gap-4">
              <h4 className="text-6xl font-display font-black">{profile?.projectsShipped || 50}+</h4>
              <span className="text-white/60 leading-tight">Projects<br/>Delivered</span>
            </div>
            <div className="flex items-center gap-4">
              <h4 className="text-6xl font-display font-black">99.9%</h4>
              <span className="text-white/60 leading-tight">System<br/>Uptime</span>
            </div>
          </motion.div>

          {/* Expertise Cards */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-3 bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-[2.5rem] shadow-sm"
          >
            <Server className="w-10 h-10 mb-4 text-blue-600" />
            <h4 className="font-display text-xl font-bold mb-2">Cloud & DevOps</h4>
            <p className="text-black/60 text-sm">AWS, Linux VPS, CI/CD pipelines, Docker containerization</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="md:col-span-3 bg-gradient-to-br from-green-50 to-green-100 p-8 rounded-[2.5rem] shadow-sm"
          >
            <Code className="w-10 h-10 mb-4 text-green-600" />
            <h4 className="font-display text-xl font-bold mb-2">Backend & APIs</h4>
            <p className="text-black/60 text-sm">Python automation, API development, database optimization</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="md:col-span-3 bg-gradient-to-br from-purple-50 to-purple-100 p-8 rounded-[2.5rem] shadow-sm"
          >
            <Users className="w-10 h-10 mb-4 text-purple-600" />
            <h4 className="font-display text-xl font-bold mb-2">Team Leadership</h4>
            <p className="text-black/60 text-sm">Cross-cultural teams, stakeholder management, Agile/Scrum</p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="md:col-span-3 bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-[2.5rem] shadow-sm"
          >
            <Briefcase className="w-10 h-10 mb-4 text-orange-600" />
            <h4 className="font-display text-xl font-bold mb-2">Project Management</h4>
            <p className="text-black/60 text-sm">End-to-end delivery, budgeting, risk management</p>
          </motion.div>

          {/* GitHub Activity */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm overflow-hidden"
          >
            <div className="flex items-center gap-4 mb-8">
              <Github className="w-8 h-8" />
              <h2 className="text-3xl md:text-4xl font-display">Contribution Activity</h2>
            </div>
            <div className="w-full overflow-x-auto pb-4">
              <div className="min-w-[800px]">
                <ContributionGraph />
              </div>
            </div>
          </motion.div>

          {/* LinkedIn Feed */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="md:col-span-12 bg-gradient-to-br from-[#0077b5]/5 to-[#0077b5]/10 border border-[#0077b5]/10 p-10 md:p-14 rounded-[2.5rem] shadow-sm"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <Linkedin className="w-8 h-8 text-[#0077b5]" />
                <h2 className="text-3xl font-display">Recent Updates</h2>
              </div>
              <a href="https://linkedin.com/in/yazeedfaumy" target="_blank" rel="noopener noreferrer" className="text-[#0077b5] font-medium hover:underline">View Profile</a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {linkedinPosts.slice(0, 2).map((post: any) => (
                <div key={post.id} className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center text-white font-bold text-sm">MYF</div>
                    <div>
                      <p className="font-bold">{profile?.name || "Mohamed Yazeed Faumy"}</p>
                      <p className="text-xs text-gray-500">{post.date}</p>
                    </div>
                  </div>
                  <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>
                  <div className="flex gap-4 text-xs text-gray-500 font-medium border-t border-gray-100 pt-3">
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
            className="md:col-span-12 bg-white p-10 md:p-14 rounded-[2.5rem] shadow-sm relative overflow-hidden"
          >
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6 relative z-10">
              <div>
                <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5 mb-4 inline-block">Career</span>
                <h2 className="text-4xl md:text-5xl font-display">Work Experience</h2>
              </div>
              <Link href="/experience">
                <button className="flex items-center gap-2 text-lg hover:opacity-60 transition-opacity" data-testid="link-experience">
                  Full Resume <ArrowRight className="w-5 h-5"/>
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
              {experience.slice(0, 4).map((job: any, i: number) => (
                <motion.div 
                  key={job.id || i} 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group border-l-4 border-black/10 pl-6 hover:border-black transition-colors"
                >
                  <span className="text-sm text-black/50 block mb-2 font-mono">{job.period}</span>
                  <h4 className="text-xl font-bold mb-1">{job.role}</h4>
                  <p className="text-lg text-black/70 mb-4">{job.company} {job.location && `• ${job.location}`}</p>
                  <ul className="text-black/60 leading-relaxed text-sm space-y-1">
                    {job.highlights.slice(0, 2).map((h: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-black/30 mt-1">•</span>
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
            <div className="flex items-center justify-between mb-8 px-4">
              <h2 className="text-3xl font-display">Featured Projects</h2>
              <Link href="/projects">
                <button className="flex items-center gap-2 hover:opacity-60 transition-opacity" data-testid="link-projects">View All <ArrowRight className="w-4 h-4"/></button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.slice(0, 4).map((project: any, i: number) => (
                <Link key={project.id || i} href={`/projects/${project.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -8 }}
                    className={`${project.color || 'bg-gray-50'} group p-10 md:p-12 rounded-[2.5rem] shadow-sm min-h-[350px] flex flex-col justify-between cursor-pointer hover:shadow-lg transition-all`}
                    data-testid={`project-card-${project.id}`}
                  >
                    <div className="w-full flex justify-end">
                      <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                        <ArrowUpRight className="w-5 h-5" />
                      </div>
                    </div>
                    <div>
                      <span className="text-black/50 font-medium mb-2 block text-sm">Featured Project</span>
                      <h3 className="text-3xl md:text-4xl font-display font-bold">{project.title}</h3>
                      <p className="mt-4 text-black/60 leading-relaxed">{project.description}</p>
                      <div className="flex flex-wrap gap-2 mt-4">
                        {(project.technologies || []).slice(0, 3).map((tech: string, j: number) => (
                          <span key={j} className="px-3 py-1 bg-white/60 rounded-full text-xs font-medium">{tech}</span>
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
            className="md:col-span-12 bg-white border border-black/5 p-10 md:p-14 rounded-[2.5rem] shadow-sm flex flex-col"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <span className="bg-black/5 px-4 py-2 rounded-full text-sm font-medium border border-black/5 mb-4 inline-block">Journal</span>
                <h2 className="text-3xl font-display">Latest Insights</h2>
              </div>
              <Link href="/blog">
                <button className="text-black font-medium hover:opacity-60 transition-opacity" data-testid="link-blog">Read all articles &rarr;</button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.slice(0, 3).map((post: any, i: number) => (
                <Link key={post.id || i} href={`/blog/${post.id}`}>
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group cursor-pointer p-6 rounded-2xl hover:bg-black/5 transition-colors"
                    data-testid={`blog-card-${post.id}`}
                  >
                    <span className="text-sm text-black/40 mb-2 block">
                      {post.publishedDate ? new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                    <h4 className="text-xl font-bold group-hover:text-black/70 transition-colors mb-2">{post.title}</h4>
                    <p className="text-sm text-black/50">{post.excerpt}</p>
                    <div className="flex gap-2 mt-4">
                      {post.tags?.slice(0, 2).map((tag: string) => (
                        <span key={tag} className="text-xs bg-black/5 px-2 py-1 rounded-md">{tag}</span>
                      ))}
                    </div>
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

        </div>

        {/* Footer */}
        <footer className="mt-20 md:mt-32 mb-10 max-w-7xl mx-auto w-full text-center">
          <h2 className="font-display text-[10vw] leading-none tracking-tight text-black/10 select-none font-black">
            YAZEED
          </h2>
          <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-sm font-medium opacity-60">
            <span>&copy; 2025 Mohamed Yazeed Faumy</span>
            <span className="hidden md:inline">&bull;</span>
            <div className="flex gap-6">
              <a href="mailto:2002yazeedfaumy@gmail.com" className="hover:text-black transition-colors">Email</a>
              <a href="https://linkedin.com/in/yazeedfaumy" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">LinkedIn</a>
              <a href="https://github.com/yazeedfaumy" target="_blank" rel="noopener noreferrer" className="hover:text-black transition-colors">GitHub</a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
