import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import {
  Home,
  User,
  Briefcase,
  Layers,
  Cpu,
  Mail,
  FileText,
} from "lucide-react";

export default function Navigation() {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/about", label: "About", icon: User },
    { href: "/experience", label: "Exp", icon: Briefcase },
    { href: "/projects", label: "Work", icon: Layers },
    { href: "/skills", label: "Skills", icon: Cpu },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.5, type: "spring", stiffness: 260, damping: 20 }}
      className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex gap-2"
    >
      <div className="flex p-2 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg shadow-black/5 gap-1">
        {/* Brand Pill */}
        <Link href="/">
          <div className="flex items-center px-4 py-2 bg-black text-white rounded-xl cursor-pointer hover:scale-105 transition-transform">
            <span className="font-display font-bold tracking-tighter whitespace-nowrap">
              ZEE DIE
            </span>
          </div>
        </Link>

        {/* Navigation Pills */}
        <div className="flex items-center gap-1 px-1">
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
                  <span className="hidden md:inline">{item.label}</span>
                  <item.icon
                    className={`w-4 h-4 md:hidden ${isActive ? "text-black" : ""}`}
                  />
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
      </div>
    </motion.nav>
  );
}
