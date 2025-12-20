import { motion } from 'framer-motion';
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ArrowLeft, Clock, Tag } from 'lucide-react';
import { Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogPosts } from '@/lib/api';

export default function Blog() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: blogs = [], isLoading } = useQuery({ queryKey: ['blog-posts'], queryFn: fetchBlogPosts });

  useEffect(() => {
    if (containerRef.current && blogs.length) {
      gsap.from(containerRef.current.querySelectorAll('.blog-card'), {
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
        opacity: 0,
        y: 30,
        stagger: 0.1,
        duration: 0.6,
      });
    }
  }, [blogs]);

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-sm mb-8"
        >
          <span className="inline-block font-mono text-xs uppercase tracking-widest text-black/60 mb-4 px-3 py-1 bg-black/5 rounded-full">Journal</span>
          <h1 className="font-display text-5xl md:text-7xl mt-4 mb-8 leading-[0.9] tracking-tighter">Latest <span className="text-black/40">Thoughts</span></h1>
        </motion.div>

        {isLoading ? (
          <div className="text-center py-20">Loading posts...</div>
        ) : (
          <div ref={containerRef} className="grid grid-cols-1 gap-6">
            {blogs.map((post: any, i: number) => (
              <Link key={post.id || i} href={`/blog/${post.id}`}>
                <motion.div
                  className="blog-card group p-8 md:p-12 bg-white rounded-[2.5rem] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
                  whileHover={{ y: -5 }}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-4 mb-4 text-sm text-black/40">
                        <span className="flex items-center gap-2">
                          <Clock className="w-4 h-4" /> 
                          {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className="flex gap-2">
                          {post.tags?.map((tag: string) => (
                            <span key={tag} className="flex items-center gap-1 bg-black/5 px-2 py-1 rounded-md">
                              <Tag className="w-3 h-3" /> {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <h3 className="font-display text-3xl md:text-4xl font-semibold mb-4 group-hover:text-black/60 transition-colors">{post.title}</h3>
                      <p className="text-lg text-black/60 leading-relaxed mb-6">{post.excerpt}</p>
                      <span className="inline-block text-black font-medium border-b border-black/20 pb-1 group-hover:border-black transition-colors">Read Article</span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
