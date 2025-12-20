import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fetchProfile, fetchAboutBlocks } from '@/lib/api';
import Footer from '@/components/Footer';

export default function About() {
  const { data: profile, isLoading: profileLoading } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const { data: blocks = [], isLoading: blocksLoading } = useQuery({ queryKey: ['about-blocks'], queryFn: fetchAboutBlocks });

  if (profileLoading || blocksLoading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/60" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-8"
        >
          <div className="md:col-span-8 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm flex flex-col justify-center">
            <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full w-fit">About Me</span>
            <h1 className="font-display text-5xl md:text-7xl mt-4 leading-[0.9] tracking-tighter">
              {profile?.role || 'Full Stack Developer'} <span className="text-black/40">based in {profile?.location || 'Remote'}</span>
            </h1>
          </div>
          
          <div className="md:col-span-4 bg-white p-2 rounded-[2.5rem] shadow-sm h-[400px] md:h-auto overflow-hidden relative">
            {profile?.profileImage ? (
              <img 
                src={profile.profileImage} 
                alt={profile.name || 'Profile'} 
                className="w-full h-full object-cover rounded-[2rem] filter grayscale hover:grayscale-0 transition-all duration-500" 
                data-testid="img-profile"
              />
            ) : (
              <div className="w-full h-full bg-black/10 rounded-[2rem] flex items-center justify-center">
                <span className="text-black/40 text-xl">No Image</span>
              </div>
            )}
          </div>
        </motion.div>

        <div className="space-y-6">
          {blocks.length > 0 ? (
            blocks.map((block: any) => (
              <motion.div
                key={block.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`p-8 md:p-12 rounded-[2.5rem] shadow-sm hover:shadow-md transition-all ${
                  block.style === 'dark' ? 'bg-black text-white' : 'bg-white'
                }`}
                data-testid={`block-about-${block.id}`}
              >
                {block.imageUrl && block.imagePosition === 'top' && (
                  <img src={block.imageUrl} alt="" className="w-full h-48 object-cover rounded-2xl mb-6" />
                )}
                <div className={block.imageUrl && (block.imagePosition === 'left' || block.imagePosition === 'right') ? 'flex gap-6 items-start' : ''}>
                  {block.imageUrl && block.imagePosition === 'left' && (
                    <img src={block.imageUrl} alt="" className="w-48 h-48 object-cover rounded-2xl flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <h3 className="font-display text-3xl mb-6">{block.title}</h3>
                    <p className={`text-xl leading-relaxed font-light ${block.style === 'dark' ? 'text-white/70' : 'text-black/60'}`}>
                      {block.content}
                    </p>
                  </div>
                  {block.imageUrl && block.imagePosition === 'right' && (
                    <img src={block.imageUrl} alt="" className="w-48 h-48 object-cover rounded-2xl flex-shrink-0" />
                  )}
                </div>
                {block.imageUrl && block.imagePosition === 'bottom' && (
                  <img src={block.imageUrl} alt="" className="w-full h-48 object-cover rounded-2xl mt-6" />
                )}
              </motion.div>
            ))
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm"
              >
                <h3 className="font-display text-3xl mb-6">About</h3>
                <p className="text-xl text-black/60 leading-relaxed font-light">
                  {profile?.bio || 'No bio available. Add content blocks in the admin panel.'}
                </p>
              </motion.div>
            </>
          )}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}
