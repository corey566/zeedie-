import { useState } from "react";
import { motion } from "framer-motion";
import { Lock, Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        setError("Invalid credentials");
        setIsLoading(false);
        return;
      }

      const data = await res.json();
      localStorage.setItem("adminToken", data.token);
      setLocation("/admin");
    } catch (err) {
      setError("Login failed. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm">
          <div className="flex items-center justify-center mb-8">
            <Lock className="w-12 h-12 text-black" />
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-center mb-2 leading-[0.9] tracking-tighter">
            Code <span className="text-black/40">Captain</span>
          </h1>
          <p className="text-center text-black/60 mb-8">Admin Portal</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-black/60 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
                required
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-black/60 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-black/10 focus:border-black focus:outline-none"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-full font-medium hover:bg-black/80 transition-colors disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {isLoading ? "Logging in..." : "Access Control Panel"}
            </button>
          </form>

          <p className="text-center text-xs text-black/40 mt-6">
            Unauthorized access is prohibited
          </p>
        </div>
      </motion.div>
      {/* Footer */}
      <footer className="mt-20 md:mt-32 mb-10 max-w-7xl mx-auto w-full text-center">
        <h2 className="font-display text-[10vw] leading-none tracking-tight text-black/10 select-none">
          ZEEDIE
        </h2>
        <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-sm font-medium opacity-60">
          <span>&copy; 2025 ZEEDIE Portfolio</span>
          <span className="hidden md:inline">&bull;</span>
          <div className="flex gap-6">
            <a href="#" className="hover:text-black">
              Twitter
            </a>
            <a href="#" className="hover:text-black">
              LinkedIn
            </a>
            <a href="#" className="hover:text-black">
              GitHub
            </a>
            <a href="#" className="hover:text-black">
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
