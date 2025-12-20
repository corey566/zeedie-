import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Download, CheckCircle2 } from "lucide-react";
import { useState, useEffect } from "react";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import Experience from "@/pages/Experience";
import Projects from "@/pages/Projects";
import Skills from "@/pages/Skills";
import Contact from "@/pages/Contact";
import Navigation from "@/components/Navigation";
import CursorTracker from "@/components/CursorTracker";
import Loader from "@/components/Loader";

function useSEO(title: string, description: string) {
  useEffect(() => {
    document.title = title;
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute('content', description);
    }
  }, [title, description]);
}

import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";

function Router() {
  useSEO("ZEEDIE | Creative Engineer", "Portfolio of ZEEDIE - Full Stack Developer & UI/UX Specialist");
  
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/experience" component={Experience} />
      <Route path="/projects" component={Projects} />
      <Route path="/skills" component={Skills} />
      <Route path="/blog" component={Blog} />
      <Route path="/blog/:id" component={BlogPost} />
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function FloatingCV() {
  const [downloaded, setDownloaded] = useState(false);

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 3000);
    // In a real app, this would trigger a file download
    window.open('/cv.pdf', '_blank');
  };

  return (
    <button 
      onClick={handleDownload}
      className="fixed bottom-6 right-6 z-40 bg-black text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all group"
    >
      {downloaded ? (
        <CheckCircle2 className="w-6 h-6 text-green-400" />
      ) : (
        <Download className="w-6 h-6 group-hover:animate-bounce" />
      )}
      <span className="absolute right-full mr-4 bg-white text-black px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
        Download CV
      </span>
    </button>
  );
}

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {loading && <Loader onComplete={() => setLoading(false)} />}
        <Toaster />
        <CursorTracker />
        <Navigation />
        <Router />
        <FloatingCV />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
