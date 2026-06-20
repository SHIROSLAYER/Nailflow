"use client";

import { Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  ContactShadows,
  Environment,
  Lightformer,
} from "@react-three/drei";
import type { Group } from "three";

function Bottle({ animate }: { animate: boolean }) {
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current || !animate) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.35 + state.pointer.x * 0.45;
    ref.current.rotation.x = state.pointer.y * -0.18;
  });

  return (
    <Float
      speed={animate ? 1.4 : 0}
      rotationIntensity={animate ? 0.22 : 0}
      floatIntensity={animate ? 0.7 : 0}
    >
      <group ref={ref} scale={0.82} position={[0, -0.35, 0]}>
        {/* corpo — esmalte rosa vidrado */}
        <mesh castShadow>
          <cylinderGeometry args={[0.85, 0.85, 1.5, 64]} />
          <meshPhysicalMaterial
            color="#c16e7c"
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            metalness={0}
          />
        </mesh>
        {/* ombro */}
        <mesh position={[0, 0.93, 0]}>
          <cylinderGeometry args={[0.34, 0.85, 0.38, 64]} />
          <meshPhysicalMaterial
            color="#c16e7c"
            roughness={0.12}
            clearcoat={1}
            clearcoatRoughness={0.08}
            metalness={0}
          />
        </mesh>
        {/* gargalo */}
        <mesh position={[0, 1.22, 0]}>
          <cylinderGeometry args={[0.31, 0.31, 0.24, 48]} />
          <meshStandardMaterial color="#b15c6a" roughness={0.3} />
        </mesh>
        {/* tampa dourada */}
        <mesh position={[0, 1.72, 0]} castShadow>
          <cylinderGeometry args={[0.4, 0.4, 0.92, 64]} />
          <meshStandardMaterial color="#c2a269" roughness={0.22} metalness={0.75} />
        </mesh>
      </group>
    </Float>
  );
}

export default function HeroPolish3D() {
  const reduce = useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );

  return (
    <Canvas
      camera={{ position: [0, 0.2, 5.2], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      frameloop={reduce ? "demand" : "always"}
      style={{ position: "absolute", inset: 0 }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 8, 5]} intensity={1.6} />
      <Suspense fallback={null}>
        <Bottle animate={!reduce} />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.32}
          scale={6}
          blur={2.6}
          far={3}
          color="#9e4e5c"
        />
        <Environment resolution={128}>
          <Lightformer form="rect" intensity={1.3} position={[3, 3, 2]} scale={4} color="#ffffff" />
          <Lightformer form="rect" intensity={0.8} position={[-4, 1, -2]} scale={5} color="#f3d9dc" />
          <Lightformer form="circle" intensity={1} position={[0, 4, -3]} scale={3} color="#c2a269" />
        </Environment>
      </Suspense>
    </Canvas>
  );
}
