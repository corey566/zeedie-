import { useRef, useMemo, Suspense, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Hook to detect dark mode
function useDarkMode() {
  const [isDark, setIsDark] = useState(false);
  
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, []);
  
  return isDark;
}

// Animated floating particles
function Particles({ count = 100, isDark = false }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -30 + Math.random() * 60;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.setScalar(s * 0.3 + 0.3);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.15, 0]} />
      <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} transparent opacity={0.08} />
    </instancedMesh>
  );
}

// Main geometric shape with distortion
function MainShape({ isDark = false }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[2, 64, 64]} scale={1.5}>
        <MeshDistortMaterial
          color={isDark ? "#333333" : "#1a1a1a"}
          attach="material"
          distort={0.3}
          speed={2}
          roughness={0.4}
          metalness={0.8}
          transparent
          opacity={0.15}
        />
      </Sphere>
    </Float>
  );
}

// Wireframe icosahedron
function WireframeShape({ isDark = false }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = -state.clock.getElapsedTime() * 0.08;
    meshRef.current.rotation.z = state.clock.getElapsedTime() * 0.1;
  });

  return (
    <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
      <mesh ref={meshRef} scale={2.5}>
        <icosahedronGeometry args={[1.5, 1]} />
        <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.12} />
      </mesh>
    </Float>
  );
}

// Torus knot decoration
function TorusDecoration({ position, isDark = false }: { position: [number, number, number], isDark?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={0.8}>
      <mesh ref={meshRef} position={position} scale={0.5}>
        <torusKnotGeometry args={[1, 0.3, 128, 16]} />
        <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.08} />
      </mesh>
    </Float>
  );
}

// Interactive mouse-following element
function MouseFollower({ isDark = false }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const { viewport, mouse } = useThree();
  
  useFrame(() => {
    if (!meshRef.current) return;
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;
    meshRef.current.position.x += (x - meshRef.current.position.x) * 0.05;
    meshRef.current.position.y += (y - meshRef.current.position.y) * 0.05;
    meshRef.current.rotation.x += 0.01;
    meshRef.current.rotation.y += 0.01;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 2]}>
      <octahedronGeometry args={[0.4, 0]} />
      <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.2} />
    </mesh>
  );
}

// Grid plane for depth
function GridPlane({ isDark = false }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
      <planeGeometry args={[100, 100, 50, 50]} />
      <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.03} />
    </mesh>
  );
}

function Fallback() {
  return null;
}

// Scene content with dark mode awareness
function SceneContent({ variant, isDark }: { variant: string, isDark: boolean }) {
  return (
    <>
      {variant === 'hero' && (
        <>
          <Particles count={80} isDark={isDark} />
          <MainShape isDark={isDark} />
          <WireframeShape isDark={isDark} />
          <TorusDecoration position={[-5, 3, -5]} isDark={isDark} />
          <TorusDecoration position={[5, -2, -3]} isDark={isDark} />
          <MouseFollower isDark={isDark} />
          <GridPlane isDark={isDark} />
        </>
      )}
      
      {variant === 'minimal' && (
        <>
          <WireframeShape isDark={isDark} />
          <Particles count={30} isDark={isDark} />
        </>
      )}
      
      {variant === 'particles' && (
        <Particles count={150} isDark={isDark} />
      )}
      
      {variant === 'geometric' && (
        <>
          <MainShape isDark={isDark} />
          <TorusDecoration position={[0, 0, 0]} isDark={isDark} />
        </>
      )}
      
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />
    </>
  );
}

interface ThreeSceneProps {
  variant?: 'hero' | 'minimal' | 'particles' | 'geometric';
  className?: string;
}

export default function ThreeScene({ variant = 'hero', className = '' }: ThreeSceneProps) {
  const isDark = useDarkMode();
  
  return (
    <div className={`absolute inset-0 -z-10 pointer-events-none ${className}`} style={{ opacity: 0.6 }}>
      <Suspense fallback={<Fallback />}>
        <Canvas 
          camera={{ position: [0, 0, 10], fov: 50 }} 
          fallback={<Fallback />}
          dpr={[1, 1.5]}
        >
          <SceneContent variant={variant} isDark={isDark} />
        </Canvas>
      </Suspense>
    </div>
  );
}

// Animated floating shapes for section backgrounds
export function FloatingShapes() {
  const isDark = useDarkMode();
  
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden" style={{ opacity: 0.4 }}>
      <Suspense fallback={<Fallback />}>
        <Canvas camera={{ position: [0, 0, 8], fov: 45 }} fallback={<Fallback />}>
          <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <mesh position={[-3, 2, 0]} scale={0.8}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.15} />
            </mesh>
          </Float>
          
          <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.8}>
            <mesh position={[3, -1, -2]} scale={0.6}>
              <tetrahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.12} />
            </mesh>
          </Float>
          
          <Float speed={2.5} rotationIntensity={0.4} floatIntensity={1.2}>
            <mesh position={[0, 1, -1]} scale={0.5}>
              <dodecahedronGeometry args={[1, 0]} />
              <meshBasicMaterial color={isDark ? "#ffffff" : "#000000"} wireframe transparent opacity={0.1} />
            </mesh>
          </Float>
          
          <ambientLight intensity={0.5} />
        </Canvas>
      </Suspense>
    </div>
  );
}
