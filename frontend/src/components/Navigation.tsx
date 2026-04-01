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
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2 w-[95%] max-w-fit"
      >
        <div className="flex p-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 gap-1 w-full justify-between md:justify-start">
          {/* Brand Pill */}
          <Link href="/">
            <div className="flex items-center px-4 py-2 bg-black text-white rounded-xl cursor-pointer hover:scale-105 transition-transform shrink-0">
              <span className="font-display font-bold tracking-tighter whitespace-nowrap">
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
                      ${isActive ? "bg-black/5 text-black" : "text-black/60 hover:text-black hover:bg-black/5"}
                    `}
                  >
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-black/5 rounded-xl -z-10"
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
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 hover:bg-black/5 rounded-xl transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-4 top-24 z-40 md:hidden"
          >
            <div className="bg-white/90 backdrop-blur-xl border border-white/20 rounded-[2rem] shadow-2xl p-4 flex flex-col gap-2">
              {navItems.map((item) => {
                 const isActive = location === item.href;
                 return (
                  <Link key={item.href} href={item.href}>
                    <div 
                      onClick={() => setIsOpen(false)}
                      className={`
                        flex items-center gap-4 p-4 rounded-xl transition-all
                        ${isActive ? "bg-black text-white" : "hover:bg-black/5 text-black/80"}
                      `}
                    >
                      <div className={`p-2 rounded-lg ${isActive ? "bg-white/20" : "bg-black/5"}`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-lg">{item.label}</span>
                    </div>
                  </Link>
                 )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
