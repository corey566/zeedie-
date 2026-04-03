import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import {
  Home,
  User,
  Briefcase,
  Layers,
  Cpu,
  Mail,
  Menu,
  X
} from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/experience", label: "Exp", icon: Briefcase },
    { href: "/projects", label: "Work", icon: Layers },
    { href: "/skills", label: "Skills", icon: Cpu },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
        className="fixed top-4 sm:top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 w-[95%] max-w-fit"
      >
        <div className="flex p-1.5 sm:p-2 bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-xl sm:rounded-2xl shadow-lg shadow-black/5 dark:shadow-black/20 gap-1 w-full justify-between md:justify-start">
          {/* Brand Pill */}
          <Link href="/">
            <div className="flex items-center px-3 sm:px-4 py-1.5 sm:py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg sm:rounded-xl cursor-pointer hover:scale-105 transition-transform shrink-0">
              <span className="font-display font-bold tracking-tighter whitespace-nowrap text-sm sm:text-base">
                MYF
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Pills */}
          <div className="hidden md:flex items-center gap-1 px-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div
                    className={`
                      relative px-4 py-2 rounded-xl text-sm font-medium cursor-pointer transition-all duration-300
                      flex items-center gap-2
                      ${isActive 
                        ? "bg-black/5 dark:bg-white/10 text-black dark:text-white" 
                        : "text-black/60 dark:text-white/60 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"}
                    `}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-black/5 dark:bg-white/10 rounded-xl -z-10"
                        transition={{
                          type: "spring",
                          bounce: 0.2,
                          duration: 0.6,
                        }}
                      />
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-black dark:text-white"
            aria-label="Toggle menu"
            data-testid="mobile-menu-toggle"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 dark:bg-black/50 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: "spring", damping: 25, stiffness: 400 }}
            className="fixed top-20 left-4 right-4 z-50 md:hidden bg-white dark:bg-[#111] rounded-2xl shadow-xl border border-black/5 dark:border-white/10 p-4"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const isActive = location === item.href;
                const Icon = item.icon;
                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium cursor-pointer transition-all
                        ${isActive 
                          ? "bg-black dark:bg-white text-white dark:text-black" 
                          : "text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10"}
                      `}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
