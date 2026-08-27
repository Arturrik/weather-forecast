import { useMemo } from "react";
import type { AtmosphereResult, WeatherData } from "../types/weather";

export function determineAtmosphere(data: WeatherData): AtmosphereResult {
  const { snowfall, precipitation, windSpeed, temperatureMax } = data;

  if (snowfall > 0) {
    return {
      type: "snow",
      description: `В этот день шёл снег, ${Math.round((temperatureMax + data.temperatureMin) / 2)}°C`,
      gradient: ["#e2e8f0", "#94a3b8"],
    };
  }

  if (precipitation > 5 && windSpeed > 20) {
    return {
      type: "storm",
      description: `Грозовой день с сильным ветром, ${Math.round(temperatureMax)}°C`,
      gradient: ["#6366f1", "#4c1d95"],
    };
  }

  if (precipitation > 5) {
    return {
      type: "rain",
      description: `В этот день шёл дождь, ${Math.round((temperatureMax + data.temperatureMin) / 2)}°C`,
      gradient: ["#3b82f6", "#1e40af"],
    };
  }

  if (temperatureMax > 25 && precipitation === 0) {
    return {
      type: "clear",
      description: `Ясный солнечный день, ${Math.round(temperatureMax)}°C`,
      gradient: ["#f59e0b", "#ef4444"],
    };
  }

  if (precipitation > 0 && precipitation <= 5) {
    return {
      type: "fog",
      description: `Туманный день с лёгкой влажностью, ${Math.round((temperatureMax + data.temperatureMin) / 2)}°C`,
      gradient: ["#64748b", "#334155"],
    };
  }

  return {
    type: "cloudy",
    description: `Облачный день, ${Math.round((temperatureMax + data.temperatureMin) / 2)}°C`,
    gradient: ["#64748b", "#475569"],
  };
}

export function useAtmosphere(data: WeatherData | null): AtmosphereResult | null {
  return useMemo(() => (data ? determineAtmosphere(data) : null), [data]);
}
