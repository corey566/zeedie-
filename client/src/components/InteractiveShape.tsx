import { useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Environment } from '@react-three/drei';
import * as THREE from 'three';

function DistortedSphere() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
  });

  return (
    <Sphere args={[1, 64, 64]} scale={[2, 2, 2]}>
      <MeshDistortMaterial
        color="#ededed"
        attach="material"
        distort={0.5}
        speed={2}
        roughness={0.2}
        metalness={0.8}
      />
    </Sphere>
  );
}

function Fallback() {
  return (
    <div className="w-full h-full bg-gradient-to-br from-white via-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center text-muted-foreground">
        <div className="text-lg font-display">Interactive Element</div>
      </div>
    </div>
  );
}

export default function InteractiveShape() {
  return (
    <div className="w-full h-[60vh] cursor-grab active:cursor-grabbing">
      <Suspense fallback={<Fallback />}>
        <Canvas camera={{ position: [0, 0, 5], fov: 45 }} fallback={<Fallback />}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <DistortedSphere />
          <Environment preset="city" />
        </Canvas>
      </Suspense>
    </div>
  );
}
