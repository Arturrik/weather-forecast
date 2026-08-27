"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { AtmosphereType } from "../types/weather";

interface WeatherParticlesProps {
  weatherType: AtmosphereType;
  reducedMotion: boolean;
  particleScale: number;
}

const BASE_RAIN = 600;
const BASE_SNOW = 120;

function RainParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();

  const { positions, velocities } = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const velocities = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * viewport.width;
      positions[i * 3 + 1] = (Math.random() - 0.5) * viewport.height;
      positions[i * 3 + 2] = 0;
      velocities[i] = 2 + Math.random() * 4;
    }
    return { positions, velocities };
  }, [count, viewport.width, viewport.height]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    const arr = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const halfH = viewport.height / 2;
    const halfW = viewport.width / 2;
    const step = delta * 3;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3 + 1] -= velocities[i] * step;
      if (arr[i3 + 1] < -halfH) {
        arr[i3 + 1] = halfH;
        arr[i3] = (Math.random() - 0.5) * halfW * 2;
      }
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#93c5fd"
        size={0.035}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function SnowParticles({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null);
  const { viewport } = useThree();
  const timeRef = useRef(0);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * viewport.width;
      arr[i * 3 + 1] = (Math.random() - 0.5) * viewport.height;
      arr[i * 3 + 2] = Math.random() * 0.5;
    }
    return arr;
  }, [count, viewport.width, viewport.height]);

  useFrame((_, delta) => {
    if (!pointsRef.current) return;
    timeRef.current += delta;
    const arr = pointsRef.current.geometry.attributes.position
      .array as Float32Array;
    const halfH = viewport.height / 2;
    const halfW = viewport.width / 2;
    const t = timeRef.current;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      arr[i3] += Math.sin(t + i) * 0.0015;
      arr[i3 + 1] -= 0.006;
      if (arr[i3 + 1] < -halfH) {
        arr[i3 + 1] = halfH;
        arr[i3] = (Math.random() - 0.5) * halfW * 2;
      }
      if (arr[i3] < -halfW) arr[i3] = halfW;
      if (arr[i3] > halfW) arr[i3] = -halfW;
    }

    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef} frustumCulled={false}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#f8fafc"
        size={0.05}
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

export function WeatherParticles({
  weatherType,
  reducedMotion,
  particleScale,
}: WeatherParticlesProps) {
  const rainCount = Math.max(80, Math.floor(BASE_RAIN * particleScale));
  const snowCount = Math.max(40, Math.floor(BASE_SNOW * particleScale));

  if (reducedMotion) return null;

  if (weatherType === "rain") {
    return <RainParticles count={rainCount} />;
  }

  if (weatherType === "snow") {
    return <SnowParticles count={snowCount} />;
  }

  return null;
}
