"use client";

import type { AtmosphereType } from "../types/weather";

interface WeatherBackgroundProps {
  weatherType: AtmosphereType;
  theme?: "dark" | "light";
  active?: boolean;
}

const DARK_GRADIENTS: Record<AtmosphereType, string> = {
  neutral: "linear-gradient(180deg, #0B0F19 0%, #1a1f2e 100%)",
  clear: "linear-gradient(165deg, #1a0f05 0%, #78350f 35%, #0B0F19 100%)",
  rain: "linear-gradient(180deg, #070d18 0%, #1e3a5f 55%, #0f172a 100%)",
  snow: "linear-gradient(180deg, #1e293b 0%, #475569 60%, #94a3b8 100%)",
  storm: "linear-gradient(180deg, #0a0612 0%, #312e81 45%, #1e1b4b 100%)",
  fog: "linear-gradient(180deg, #1e293b 0%, #64748b 50%, #334155 100%)",
  cloudy: "linear-gradient(180deg, #111827 0%, #374151 100%)",
};

const LIGHT_GRADIENTS: Record<AtmosphereType, string> = {
  neutral: "linear-gradient(180deg, #e8edf4 0%, #dbeafe 100%)",
  clear: "linear-gradient(165deg, #fef3c7 0%, #fde68a 40%, #e8edf4 100%)",
  rain: "linear-gradient(180deg, #bfdbfe 0%, #93c5fd 50%, #dbeafe 100%)",
  snow: "linear-gradient(180deg, #e2e8f0 0%, #f1f5f9 60%, #ffffff 100%)",
  storm: "linear-gradient(180deg, #c7d2fe 0%, #818cf8 50%, #e0e7ff 100%)",
  fog: "linear-gradient(180deg, #cbd5e1 0%, #e2e8f0 100%)",
  cloudy: "linear-gradient(180deg, #d1d5db 0%, #e5e7eb 100%)",
};

export function WeatherBackground({
  weatherType,
  theme = "dark",
  active = false,
}: WeatherBackgroundProps) {
  const palette = theme === "light" ? LIGHT_GRADIENTS : DARK_GRADIENTS;
  const type = active ? weatherType : "neutral";
  const background = palette[type];

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div
        className="absolute inset-0 transition-[background] duration-[1500ms] ease-in-out"
        style={{ background }}
      />

      {active && weatherType === "clear" && (
        <div className="weather-overlay weather-sun" />
      )}

      {active && weatherType === "storm" && (
        <div className="weather-overlay weather-lightning" />
      )}

      {active && weatherType === "fog" && (
        <div className="weather-overlay weather-fog" />
      )}
    </div>
  );
}
