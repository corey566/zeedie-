import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Download, CheckCircle2, Loader2, Moon, Sun } from "lucide-react";
import { useState, useEffect, createContext, useContext } from "react";
import { fetchSiteConfig, generateResume } from "@/lib/api";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Experience from "@/pages/Experience";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import Skills from "@/pages/Skills";
import Contact from "@/pages/Contact";
import Navigation from "@/components/Navigation";
import CursorTracker from "@/components/CursorTracker";
import Loader from "@/components/Loader";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Admin from "@/pages/Admin";
import AdminLogin from "@/pages/AdminLogin";

// Theme Context
type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ 
  theme: 'light', 
  toggleTheme: () => {} 
});

export const useTheme = () => useContext(ThemeContext);

function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
}

function ProtectedAdminRoute() {
  const [, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    fetch('/api/admin/verify', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          localStorage.removeItem('adminToken');
          setIsAuthenticated(false);
        }
      })
      .catch(() => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
      });
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      setLocation('/admin/login');
    }
  }, [isAuthenticated, setLocation]);

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] dark:bg-[#0a0a0a]">
        <Loader2 className="w-8 h-8 animate-spin text-black/60 dark:text-white/60" />
      </div>
    );
  }

  if (isAuthenticated === false) {
    return null;
  }

  return <Admin />;
}

function Router() {
  const { data: siteConfig } = useQuery({ queryKey: ['site-config'], queryFn: fetchSiteConfig });
  
  useSEO(
    siteConfig?.seo?.title || "Mohamed Yazeed Faumy | IT Manager & Technical Lead", 
    siteConfig?.seo?.description || "Portfolio of Mohamed Yazeed Faumy - IT Manager / Technical Operations Lead"
  );

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/experience" component={Experience} />
      <Route path="/projects" component={Projects} />
      <Route path="/projects/:id" component={ProjectDetail} />
      <Route path="/skills" component={Skills} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/contact" component={Contact} />
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin" component={ProtectedAdminRoute} />
      <Route component={NotFound} />
    </Switch>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button 
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-40 bg-white dark:bg-black text-black dark:text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all border border-black/10 dark:border-white/10"
      aria-label="Toggle theme"
      data-testid="theme-toggle"
    >
      {theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  );
}

function FloatingCV() {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    
    try {
      // Fetch resume data
      const resumeData = await generateResume();
      
      // Create a simple text-based resume for download
      const resumeText = generateResumeText(resumeData);
      
      // Create and download file
      const blob = new Blob([resumeText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${resumeData.profile?.name?.replace(/\s+/g, '_') || 'Resume'}_CV.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloaded(true);
      setTimeout(() => setDownloaded(false), 3000);
    } catch (error) {
      console.error('Failed to download resume:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={downloading}
      className="fixed bottom-6 right-6 z-40 bg-black dark:bg-white text-white dark:text-black p-4 rounded-full shadow-2xl hover:scale-110 transition-all group disabled:opacity-50"
      data-testid="download-cv-btn"
    >
      {downloading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : downloaded ? (
        <CheckCircle2 className="w-6 h-6 text-green-400" />
      ) : (
        <Download className="w-6 h-6 group-hover:animate-bounce" />
      )}
      <span className="absolute right-full mr-4 bg-white dark:bg-black text-black dark:text-white px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm border border-black/10 dark:border-white/10">
        Download CV
      </span>
    </button>
  );
}

function generateResumeText(data: any): string {
  const { profile, experience, skills, projects, socials } = data;
  
  let text = `
================================================================================
                              ${profile?.name || 'Resume'}
================================================================================

${profile?.role || ''}
${profile?.location || ''}
${profile?.email || ''}

--------------------------------------------------------------------------------
                                   SUMMARY
--------------------------------------------------------------------------------
${profile?.bio || ''}

--------------------------------------------------------------------------------
                                 EXPERIENCE
--------------------------------------------------------------------------------
`;

  experience?.forEach((exp: any) => {
    text += `
${exp.role}
${exp.company} | ${exp.location}
${exp.period}
${exp.highlights?.map((h: string) => `  • ${h}`).join('\n') || ''}
`;
  });

  text += `
--------------------------------------------------------------------------------
                                   SKILLS
--------------------------------------------------------------------------------
`;

  Object.entries(skills || {}).forEach(([category, skillList]) => {
    text += `
${category}:
  ${(skillList as string[]).join(', ')}
`;
  });

  text += `
--------------------------------------------------------------------------------
                                  PROJECTS
--------------------------------------------------------------------------------
`;

  projects?.forEach((proj: any) => {
    text += `
${proj.title}
${proj.description}
Technologies: ${proj.technologies?.join(', ') || ''}
`;
  });

  text += `
--------------------------------------------------------------------------------
                                  CONTACT
--------------------------------------------------------------------------------
`;

  socials?.forEach((social: any) => {
    text += `${social.platform}: ${social.value}\n`;
  });

  text += `
================================================================================
                     Generated: ${new Date().toLocaleDateString()}
================================================================================
`;

  return text;
}

function App() {
  const [loading, setLoading] = useState(true);
  const [location] = useLocation();
  const [theme, setTheme] = useState<Theme>('light');
  
  const isAdminPage = location.startsWith('/admin');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          {loading && <Loader onComplete={() => setLoading(false)} />}
          <Toaster />
          <CursorTracker />
          {!isAdminPage && <Navigation />}
          <Router />
          {!isAdminPage && <ThemeToggle />}
          <FloatingCV />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeContext.Provider>
  );
}

export default App;
