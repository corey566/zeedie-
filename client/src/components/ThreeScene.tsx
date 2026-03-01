import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float } from '@react-three/drei';
import * as THREE from 'three';

function AbstractShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(2, 4), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    
    const { mouse } = state;
    meshRef.current.rotation.x += (mouse.y * 0.2 - meshRef.current.rotation.x) * 0.05;
    meshRef.current.rotation.y += (mouse.x * 0.2 - meshRef.current.rotation.y) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef} geometry={geometry} scale={[1.2, 1.2, 1.2]}>
        <meshBasicMaterial 
          color="#A3A3A3" 
          wireframe 
          transparent 
          opacity={0.3} 
        />
      </mesh>
    </Float>
  );
}

function Fallback() {
  return null;
}

export default function ThreeScene() {
  return (
    <div className="absolute inset-0 -z-10 pointer-events-none opacity-50">
      <Suspense fallback={<Fallback />}>
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} fallback={<Fallback />}>
          <AbstractShape />
          <Environment preset="studio" />
        </Canvas>
      </Suspense>
    </div>
  );
}
