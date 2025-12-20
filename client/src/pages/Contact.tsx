import { motion } from 'framer-motion';
import { Mail, Linkedin, Github, Twitter, MapPin } from 'lucide-react';

const socials = [
  { icon: Mail, label: 'Email', value: 'hello@example.com', href: 'mailto:hello@example.com' },
  { icon: Linkedin, label: 'LinkedIn', value: 'linkedin.com/in/yourprofile', href: 'https://linkedin.com' },
  { icon: Github, label: 'GitHub', value: 'github.com/yourprofile', href: 'https://github.com' },
  { icon: Twitter, label: 'Twitter', value: '@yourprofile', href: 'https://twitter.com' },
];

export default function Contact() {
  return (
    <div className="min-h-screen bg-background text-foreground pt-32 px-6 md:px-12 pb-20 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-primary mb-4 px-3 py-1 bg-primary/10 rounded-full">Get In Touch</span>
          <h1 className="font-display text-6xl md:text-7xl tracking-tight mb-6 mt-4">Let's Work Together</h1>
          
          <p className="text-xl text-muted-foreground mb-12 max-w-lg mx-auto">
            I'm always interested in hearing about new projects and opportunities. Let's build something amazing.
          </p>

          <motion.a
            href="mailto:hello@example.com"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="inline-block px-8 py-4 bg-primary text-background font-medium text-lg hover:opacity-90 transition-all duration-300 rounded-lg mb-20 cursor-pointer"
          >
            Send Me an Email
          </motion.a>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
          {socials.map((social, i) => {
            const Icon = social.icon;
            return (
              <motion.a
                key={i}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="group p-6 bg-secondary/30 border-2 border-border rounded-xl hover:border-primary/50 hover:bg-primary/5 transition-all duration-300"
              >
                <Icon className="w-6 h-6 text-primary mb-3 group-hover:scale-110 transition-transform" />
                <p className="text-sm text-muted-foreground mb-1">{social.label}</p>
                <p className="font-medium group-hover:text-primary transition-colors">{social.value}</p>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-12 border-t border-border text-center text-muted-foreground"
        >
          <p className="flex items-center justify-center gap-2 mb-2">
            <MapPin className="w-4 h-4" />
            Kingston, Jamaica • Remote Available
          </p>
          <p className="text-sm">Available for full-time, contract, and consulting opportunities.</p>
        </motion.div>
      </div>
    </div>
  );
}
