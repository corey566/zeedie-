import { motion } from "framer-motion";
import { Link } from "wouter";

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-4 flex justify-between items-center">
        <Link href="/">
          <span className="font-display font-bold tracking-tight text-xl hover:opacity-70 transition-opacity cursor-pointer">
            ALEXANDER
          </span>
        </Link>
        
        <div className="flex gap-8 text-sm font-medium">
          <Link href="/about">
            <span className="hover:text-primary transition-colors cursor-pointer">ABOUT</span>
          </Link>
          <Link href="/experience">
            <span className="hover:text-primary transition-colors cursor-pointer">EXPERIENCE</span>
          </Link>
          <Link href="/projects">
            <span className="hover:text-primary transition-colors cursor-pointer">PROJECTS</span>
          </Link>
          <Link href="/skills">
            <span className="hover:text-primary transition-colors cursor-pointer">SKILLS</span>
          </Link>
          <Link href="/contact">
            <span className="hover:text-primary transition-colors cursor-pointer">CONTACT</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
