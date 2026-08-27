"use client";

import { motion } from "framer-motion";
import { Card } from "./ui/Card";
import { Button } from "./ui/Button";
import type { AtmosphereResult, WeatherData } from "../types/weather";

interface WeatherCardProps {
  data: WeatherData;
  atmosphere: AtmosphereResult;
  isLoading?: boolean;
  onSave: () => void;
  onReset: () => void;
}

function WeatherIcon({ type }: { type: string }) {
  const icons: Record<string, string> = {
    clear: "☀️",
    rain: "🌧️",
    snow: "❄️",
    storm: "⛈️",
    fog: "🌫️",
    cloudy: "☁️",
    neutral: "🌤️",
  };

  return <span className="text-6xl md:text-7xl">{icons[type] ?? "🌤️"}</span>;
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr + "T12:00:00");
  return date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function WeatherCard({
  data,
  atmosphere,
  isLoading,
  onSave,
  onReset,
}: WeatherCardProps) {
  const avgTemp = Math.round((data.temperatureMax + data.temperatureMin) / 2);

  if (isLoading) {
    return (
      <Card shimmer className="w-full max-w-xl space-y-4">
        <div className="h-6 w-2/3 rounded-lg bg-black/10 dark:bg-white/10" />
        <div className="h-16 w-16 rounded-full bg-black/10 dark:bg-white/10" />
        <div className="h-10 w-1/3 rounded-lg bg-black/10 dark:bg-white/10" />
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="w-full max-w-xl"
    >
      <Card className="space-y-6">
        <div className="text-center">
          <p className="theme-muted text-sm uppercase tracking-widest">
            {data.city}, {data.country}
          </p>
          <p className="theme-text mt-1 capitalize">
            {formatDate(data.date)}
          </p>
        </div>

        <div className="flex flex-col items-center gap-2">
          <WeatherIcon type={atmosphere.type} />
          <p
            className="font-mono text-5xl font-bold tabular-nums md:text-6xl"
            style={{
              background: `linear-gradient(135deg, ${atmosphere.gradient[0]}, ${atmosphere.gradient[1]})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {avgTemp}°C
          </p>
          <p className="theme-muted text-sm">
            {Math.round(data.temperatureMin)}° — {Math.round(data.temperatureMax)}°C
          </p>
        </div>

        <p className="theme-text text-center text-lg">{atmosphere.description}</p>

        <div className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          {[
            { label: "Осадки", value: `${data.precipitation.toFixed(1)} мм` },
            { label: "Ветер", value: `${Math.round(data.windSpeed)} км/ч` },
            { label: "Дождь", value: `${data.rain.toFixed(1)} мм` },
            { label: "Снег", value: `${data.snowfall.toFixed(1)} см` },
          ].map((stat) => (
            <div
              key={stat.label}
              className="stat-box rounded-xl p-3 text-center"
            >
              <p className="theme-muted text-xs">{stat.label}</p>
              <p className="theme-text mt-1 font-mono tabular-nums">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <Button onClick={onSave} size="lg" className="w-full sm:min-w-[260px]">
            Сохранить воспоминание
          </Button>
          <Button variant="ghost" onClick={onReset}>
            Новый поиск
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
