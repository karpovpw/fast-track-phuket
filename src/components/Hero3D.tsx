import { Component, useRef, useState, type ErrorInfo, type ReactNode } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

type CanvasErrorBoundaryProps = {
  children: ReactNode;
};

type CanvasErrorBoundaryState = {
  hasError: boolean;
};

class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.warn('3D background disabled after WebGL render failure.', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return <AmbientFallback />;
    }

    return this.props.children;
  }
}

const hasUsableWebGL = () => {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(
      canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) ||
      canvas.getContext('experimental-webgl', { failIfMajorPerformanceCaveat: true }),
    );
  } catch {
    return false;
  }
};

function AmbientFallback() {
  return <div className="hero-ambient-bg" aria-hidden="true" />;
}

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
  const [canRender3D] = useState(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    return !prefersReducedMotion && hasUsableWebGL();
  });

  if (!canRender3D) {
    return <AmbientFallback />;
  }

  return (
    <CanvasErrorBoundary>
      <div className="hero-3d-bg" aria-hidden="true">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 45 }}
          gl={{
            alpha: true,
            antialias: true,
            failIfMajorPerformanceCaveat: true,
            powerPreference: 'low-power',
          }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0);
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} />
          <AnimatedSphere />
          <Environment preset="city" />
        </Canvas>
      </div>
    </CanvasErrorBoundary>
  );
}
