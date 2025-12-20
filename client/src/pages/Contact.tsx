import { motion } from "framer-motion";
import { Mail, Linkedin, Github, Twitter } from "lucide-react";

const socials = [
  { icon: Mail, label: "Email", href: "mailto:hello@alexander.dev" },
  { icon: Linkedin, label: "LinkedIn", href: "https://linkedin.com" },
  { icon: Github, label: "GitHub", href: "https://github.com" },
  { icon: Twitter, label: "Twitter", href: "https://twitter.com" },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-24 px-6 md:px-12 flex flex-col justify-center">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-mono text-xs uppercase tracking-widest text-primary block mb-6">Get In Touch</span>
          <h1 className="font-display text-6xl md:text-7xl tracking-tight mb-8">Let's Work Together</h1>
          
          <p className="text-xl text-muted-foreground mb-12">
            I'm always interested in hearing about new projects and opportunities. Feel free to reach out!
          </p>

          <motion.a
            href="mailto:hello@alexander.dev"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-8 py-4 bg-primary text-background font-medium text-lg hover:opacity-90 transition-opacity mb-16"
          >
            Send Me an Email
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="flex justify-center gap-8 pt-16 border-t border-border"
        >
          {socials.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group flex flex-col items-center gap-2 hover:text-primary transition-colors"
              >
                <Icon className="w-8 h-8 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-muted-foreground">{social.label}</span>
              </motion.a>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}
