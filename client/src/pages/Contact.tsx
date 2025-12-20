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
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center bg-white p-12 rounded-[3rem] shadow-sm mb-8"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full">Get In Touch</span>
          <h1 className="font-display text-5xl md:text-7xl tracking-tight mb-6 mt-4">Let's Work <span className="text-black/40">Together</span></h1>
          
          <p className="text-xl text-black/60 mb-12 max-w-lg mx-auto leading-relaxed">
            I'm always interested in hearing about new projects and opportunities. Let's build something amazing.
          </p>

          <motion.a
            href="mailto:hello@example.com"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileHover={{ scale: 1.05 }}
            className="inline-block px-10 py-5 bg-black text-white font-medium text-lg hover:shadow-xl transition-all duration-300 rounded-full mb-8 cursor-pointer"
          >
            Send Me an Email
          </motion.a>
        </motion.div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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
                className="group p-8 bg-white rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-4"
              >
                <div className="w-12 h-12 bg-black/5 rounded-full flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                   <p className="text-sm text-black/40 mb-1">{social.label}</p>
                   <p className="font-medium group-hover:text-black/80 transition-colors">{social.value}</p>
                </div>
              </motion.a>
            );
          })}
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="pt-12 border-t border-black/5 text-center text-black/40"
        >
          <p className="flex items-center justify-center gap-2 mb-2 font-medium">
            <MapPin className="w-4 h-4" />
            Kingston, Jamaica • Remote Available
          </p>
          <p className="text-sm">Available for full-time, contract, and consulting opportunities.</p>
        </motion.div>
      </div>
    </div>
  );
}
