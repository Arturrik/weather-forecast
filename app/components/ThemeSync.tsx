"use client";

import { useEffect } from "react";
import { useWeatherStore } from "../store/weatherStore";

export function ThemeSync() {
  const theme = useWeatherStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark", "light");
    root.classList.add(theme);
  }, [theme]);

  return null;
}
