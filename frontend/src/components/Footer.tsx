
import { useQuery } from '@tanstack/react-query';
import { fetchSocials, fetchProfile } from '@/lib/api';

export default function Footer() {
  const { data: socials = [] } = useQuery({ queryKey: ['socials'], queryFn: fetchSocials });
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });

  const displayName = profile?.name || "Mohamed Yazeed Faumy";
  const shortName = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase();

  return (
    <footer className="mt-20 md:mt-32 mb-10 max-w-7xl mx-auto w-full text-center">
      <h2 className="font-display text-[10vw] leading-none tracking-tight text-black/10 select-none font-black">
        {displayName.split(' ').pop()?.toUpperCase() || 'YAZEED'}
      </h2>
      <div className="flex flex-col md:flex-row justify-center items-center gap-6 mt-8 text-sm font-medium opacity-60">
        <span>&copy; 2025 {displayName}</span>
        <span className="hidden md:inline">&bull;</span>
        <div className="flex gap-6">
          {socials.map((social: any) => (
            <a 
              key={social.id} 
              href={social.href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-black transition-colors"
            >
              {social.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
