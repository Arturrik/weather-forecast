"use client";

import { WeatherBackground } from "./WeatherBackground";
import type { AtmosphereType, AppStep } from "../types/weather";

interface HeroSceneProps {
  weatherType: AtmosphereType;
  step: AppStep;
  theme?: "dark" | "light";
}

export function HeroScene({
  weatherType,
  step,
  theme = "dark",
}: HeroSceneProps) {
  const showWeather = step === "result";

  return (
    <WeatherBackground
      weatherType={weatherType}
      theme={theme}
      active={showWeather}
    />
  );
}
