import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

function DistortedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    // Rotate slowly
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    
    // Scale on hover could be added here if we had hover state
  });

  return (
    <Sphere args={[1, 64, 64]} scale={[2, 2, 2]}>
      <MeshDistortMaterial
        color="#ededed"
        attach="material"
        distort={0.5} // Strength, 0 disables the effect (default=1)
        speed={2} // Speed (default=1)
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

export default function InteractiveShape() {
  return (
    <div className="w-full h-[60vh] cursor-grab active:cursor-grabbing">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <DistortedSphere />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
