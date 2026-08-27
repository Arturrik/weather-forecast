"use client";

import { useRef, useMemo, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { vertexShader, fragmentShader, WEATHER_TYPE_MAP } from "../shaders";
import type { AtmosphereType } from "../types/weather";

interface AtmosphericShaderProps {
  weatherType: AtmosphereType;
  transition: number;
  reducedMotion: boolean;
  scrollDepth: number;
  shaderQuality: number;
  targetFps: number;
}

export function AtmosphericShader({
  weatherType,
  transition,
  reducedMotion,
  scrollDepth,
  shaderQuality,
  targetFps,
}: AtmosphericShaderProps) {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const { viewport, invalidate } = useThree();
  const flashRef = useRef(0);
  const nextFlashRef = useRef(0);
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uWeatherType: { value: WEATHER_TYPE_MAP.neutral },
      uTransition: { value: 0 },
      uFlashIntensity: { value: 0 },
      uReducedMotion: { value: 0 },
      uScrollDepth: { value: 0 },
      uQuality: { value: 1 },
    }),
    []
  );

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uWeatherType.value =
        WEATHER_TYPE_MAP[weatherType];
    }
    invalidate();
  }, [weatherType, invalidate]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uReducedMotion.value = reducedMotion ? 1 : 0;
      materialRef.current.uniforms.uQuality.value = shaderQuality;
    }
    invalidate();
  }, [reducedMotion, shaderQuality, invalidate]);

  useEffect(() => {
    const interval = setInterval(() => invalidate(), 1000 / targetFps);
    return () => clearInterval(interval);
  }, [targetFps, invalidate]);

  useEffect(() => {
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        mouseRef.current.set(
          e.clientX / window.innerWidth,
          1 - e.clientY / window.innerHeight
        );
        invalidate();
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [invalidate]);

  useFrame((state) => {
    if (!materialRef.current) return;

    const mat = materialRef.current;
    mat.uniforms.uTime.value = state.clock.elapsedTime;
    mat.uniforms.uMouse.value.copy(mouseRef.current);
    mat.uniforms.uResolution.value.set(viewport.width, viewport.height);
    mat.uniforms.uTransition.value = THREE.MathUtils.lerp(
      mat.uniforms.uTransition.value,
      transition,
      0.06
    );
    mat.uniforms.uScrollDepth.value = scrollDepth;

    if (weatherType === "storm" && !reducedMotion) {
      if (state.clock.elapsedTime >= nextFlashRef.current) {
        flashRef.current = 1;
        nextFlashRef.current =
          state.clock.elapsedTime + 0.3 + Math.random() * 2.7;
      }
      flashRef.current *= 0.85;
      mat.uniforms.uFlashIntensity.value = flashRef.current;
    } else {
      mat.uniforms.uFlashIntensity.value = 0;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}
