
import { useQuery } from '@tanstack/react-query';
import { fetchSocials } from '@/lib/api';

export default function Footer() {
  const { data: socials = [] } = useQuery({ queryKey: ['socials'], queryFn: fetchSocials });

  return (
    <footer className="mt-20 md:mt-32 mb-10 max-w-7xl mx-auto w-full text-center">
      <h2 className="font-display text-[10vw] leading-none tracking-tight text-black/10 select-none">
        ZEEDIE
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-sm font-medium opacity-60">
        <span>&copy; 2025 ZEEDIE Portfolio</span>
        <span className="hidden md:inline">&bull;</span>
        <div className="flex gap-6">
          {socials.map((social: any) => (
            <a 
              key={social.id} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-black"
            >
              {social.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
