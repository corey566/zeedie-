import { motion } from "framer-motion";
import { ArrowLeft, Home } from "lucide-react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f2f2f2] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-xl"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-8"
        >
          <span className="font-display text-[12rem] md:text-[16rem] leading-none tracking-tighter text-black/10 select-none">
            404
          </span>
        </motion.div>

        <h1 
          className="font-display text-4xl md:text-5xl tracking-tighter mb-4 leading-tight"
          data-testid="text-notfound-title"
        >
          Page not <span className="text-black/40">found</span>
        </h1>

        <p 
          className="text-black/60 text-lg mb-12 max-w-md mx-auto"
          data-testid="text-notfound-description"
        >
          The page you're looking for doesn't exist or has been moved. Let's get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors"
              data-testid="button-notfound-home"
            >
              <Home className="w-4 h-4" />
              Back to Home
            </motion.button>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 bg-white text-black rounded-full font-medium border border-black/10 hover:border-black/30 transition-colors"
            data-testid="button-notfound-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 grid grid-cols-3 gap-8 text-center border-t border-black/10 pt-8"
        >
          <Link href="/projects">
            <span className="block text-sm text-black/40 hover:text-black transition-colors cursor-pointer" data-testid="link-notfound-projects">
              Projects
            </span>
          </Link>
          <Link href="/blog">
            <span className="block text-sm text-black/40 hover:text-black transition-colors cursor-pointer" data-testid="link-notfound-blog">
              Journal
            </span>
          </Link>
          <Link href="/contact">
            <span className="block text-sm text-black/40 hover:text-black transition-colors cursor-pointer" data-testid="link-notfound-contact">
              Contact
            </span>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
