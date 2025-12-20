import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function FloatingShape() {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      // Scene setup
      const scene = new THREE.Scene();
      sceneRef.current = scene;
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 5;

      // Renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      rendererRef.current = renderer;
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      renderer.setClearColor(0xffffff, 0);
      containerRef.current.appendChild(renderer.domElement);

      // Create icosahedron geometry
      const geometry = new THREE.IcosahedronGeometry(1.5, 5);
      const material = new THREE.MeshPhongMaterial({
        color: 0x0a0a0a,
        emissive: 0x1a1a1a,
        shininess: 100,
        wireframe: false,
      });
      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Add wireframe
      const wireframeGeometry = new THREE.IcosahedronGeometry(1.5, 5);
      const wireframeMaterial = new THREE.LineBasicMaterial({
        color: 0xaaaaaa,
        linewidth: 1,
        transparent: true,
        opacity: 0.2,
      });
      const wireframe = new THREE.LineSegments(
        new THREE.EdgesGeometry(wireframeGeometry),
        wireframeMaterial
      );
      mesh.add(wireframe);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(5, 5, 5);
      scene.add(directionalLight);

      // Animation loop
      let animationId: number;
      const animate = () => {
        animationId = requestAnimationFrame(animate);
        mesh.rotation.x += 0.002;
        mesh.rotation.y += 0.003;
        renderer.render(scene, camera);
      };
      animate();

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current) return;
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
        cancelAnimationFrame(animationId);
        if (containerRef.current && rendererRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement);
        }
        geometry.dispose();
        material.dispose();
        renderer.dispose();
      };
    } catch (error) {
      console.error("Three.js error:", error);
      // Fallback: show a gradient
      if (containerRef.current) {
        containerRef.current.style.background = "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)";
      }
    }
  }, []);

  return <div ref={containerRef} className="w-full h-full" />;
}
