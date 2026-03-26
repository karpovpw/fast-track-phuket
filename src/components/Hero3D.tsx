import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  const meshRef = useRef<THREE.Mesh>(null!);

  useFrame((state) => {
    // Read the window scroll to drive the 3D element
    const scrollY = window.scrollY;
    const progress = Math.min(scrollY / 1000, 1);

    meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2 + progress * Math.PI;
    meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    
    // Scale and move based on scroll to create a dynamic background effect
    meshRef.current.position.y = -progress * 2;
    meshRef.current.position.x = Math.sin(progress * Math.PI) * 1.5;
    
    const scaleMultiplier = 1.5 + progress * 0.5;
    meshRef.current.scale.set(scaleMultiplier, scaleMultiplier, scaleMultiplier);
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          color="#d4af37"
          roughness={0.2}
          metalness={0.8}
          distort={0.4}
          speed={2}
          envMapIntensity={1}
        />
      </mesh>
    </Float>
  );
}

export default function Hero3D() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, opacity: 0.6, pointerEvents: 'none' }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <AnimatedSphere />
        <Environment preset="city" />
      </Canvas>
    </div>
  );
}
