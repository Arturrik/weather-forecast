"use client";

import { useEffect, useState } from "react";

export interface PerformanceProfile {
  isMobile: boolean;
  isLowPower: boolean;
  dpr: number;
  targetFps: number;
  particleScale: number;
  shaderQuality: number;
}

function detectLowPower(): boolean {
  if (typeof navigator === "undefined") return false;

  const cores = navigator.hardwareConcurrency ?? 4;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  return cores <= 4 || memory <= 4 || coarse;
}

export function usePerformanceMode(): PerformanceProfile {
  const [profile, setProfile] = useState<PerformanceProfile>({
    isMobile: false,
    isLowPower: false,
    dpr: 1,
    targetFps: 30,
    particleScale: 1,
    shaderQuality: 1,
  });

  useEffect(() => {
    const mobile = window.innerWidth < 768;
    const lowPower = detectLowPower();

    setProfile({
      isMobile: mobile,
      isLowPower: lowPower,
      dpr: mobile || lowPower ? 1 : Math.min(window.devicePixelRatio, 1.25),
      targetFps: lowPower ? 24 : mobile ? 30 : 30,
      particleScale: mobile ? 0.35 : lowPower ? 0.5 : 0.7,
      shaderQuality: mobile || lowPower ? 0 : 1,
    });

    const onResize = () => {
      const isMobile = window.innerWidth < 768;
      setProfile((prev) => ({ ...prev, isMobile: isMobile, dpr: isMobile ? 1 : prev.dpr }));
    };

    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return profile;
}
