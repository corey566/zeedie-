import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CursorTracker() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const dot = dotRef.current;
    if (!cursor || !dot) return;

    const handleMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        overwrite: 'auto',
      });

      gsap.to(dot, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed w-2 h-2 bg-primary rounded-full pointer-events-none z-50"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 border-2 border-primary rounded-full pointer-events-none z-50"
        style={{ transform: 'translate(-50%, -50%)', opacity: 0.5 }}
      />
    </>
  );
}
