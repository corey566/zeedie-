import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import { Link, useRoute } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { fetchBlogPost } from '@/lib/api';
import NotFound from './not-found';

export default function BlogPost() {
  const [match, params] = useRoute('/blog/:id');
  const { data: post, isLoading } = useQuery({ 
    queryKey: ['blog-post', params?.id], 
    queryFn: () => fetchBlogPost(params?.id || ''),
    enabled: !!params?.id 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f2f2f2] flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!post) return <NotFound />;

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-foreground font-sans pt-32 px-4 md:px-12 pb-20">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <Link href="/blog">
          <button className="flex items-center gap-2 text-black/60 hover:text-black mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Journal
          </button>
        </Link>

        <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-sm">
          <header className="mb-12 border-b border-black/10 pb-12">
            <div className="flex flex-wrap gap-3 mb-6">
              {post.tags?.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-black/5 rounded-full text-sm font-medium text-black/60">
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="font-display text-4xl md:text-6xl leading-[1.1] mb-6">{post.title}</h1>
            <div className="flex items-center justify-between text-black/40">
              <span className="flex items-center gap-2">
                <Clock className="w-4 h-4" /> 
                {new Date(post.publishedDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
              <button className="flex items-center gap-2 hover:text-black transition-colors">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </header>

          <article className="prose prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-p:text-black/70 prose-a:text-black prose-a:no-underline prose-a:border-b prose-a:border-black/20 hover:prose-a:border-black">
            {/* Mock Content - In a real app this would be Markdown/HTML */}
            <p className="lead text-xl md:text-2xl font-light text-black/80 mb-8">{post.excerpt}</p>
            
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
            
            <h3>The Shift in Paradigm</h3>
            <p>
              Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
            
            <blockquote className="border-l-4 border-black pl-6 italic my-8 text-2xl">
              "Design is not just what it looks like and feels like. Design is how it works."
            </blockquote>

            <div className="my-12 p-8 bg-black/5 rounded-2xl">
              <h4 className="mt-0 mb-4">Key Takeaways</h4>
              <ul className="mb-0">
                <li>Focus on user experience first</li>
                <li>Performance is a feature</li>
                <li>Simplicity scales better than complexity</li>
              </ul>
            </div>

            <p>
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
            </p>
          </article>
        </div>
      </motion.div>
    </div>
  );
}
