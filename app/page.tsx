"use client";

import { HeroScene } from "./components/HeroScene";
import { useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { WeatherForm } from "./components/WeatherForm";
import { WeatherCard } from "./components/WeatherCard";
import { ShareModal } from "./components/ShareModal";
import { useWeatherStore } from "./store/weatherStore";
import { useWeather } from "./hooks/useWeather";
import { determineAtmosphere } from "./hooks/useAtmosphere";
import { ThemeSync } from "./components/ThemeSync";
import { Button } from "./components/ui/Button";
import type { GeoLocation } from "./types/weather";

const title = "Погодный тайм-капсул";

function AnimatedTitle() {
  return (
    <motion.h1
      className="font-display theme-text text-center text-5xl font-bold tracking-tight md:text-7xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {title}
    </motion.h1>
  );
}

export default function HomePage() {
  const {
    step,
    atmosphere,
    weatherData,
    errorMessage,
    theme,
    setStep,
    setLocation,
    setDate,
    setWeatherData,
    setAtmosphere,
    setError,
    reset,
    setTheme,
  } = useWeatherStore();

  const { fetchWeather } = useWeather();
  const [shareOpen, setShareOpen] = useState(false);

  const handleSubmit = useCallback(
    async (location: GeoLocation, date: string) => {
      setLocation(location);
      setDate(date);
      setStep("loading");
      setError(null);

      try {
        const data = await fetchWeather(location, date);
        const atm = determineAtmosphere(data);
        setWeatherData(data);
        setAtmosphere(atm.type);
        setStep("result");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Этот день ушёл в туман времени"
        );
        setStep("error");
      }
    },
    [
      fetchWeather,
      setAtmosphere,
      setDate,
      setError,
      setLocation,
      setStep,
      setWeatherData,
    ]
  );

  const atmosphereResult =
    weatherData != null ? determineAtmosphere(weatherData) : null;

  return (
    <main className="theme-text relative min-h-screen overflow-x-hidden">
      <ThemeSync />
      <HeroScene weatherType={atmosphere} step={step} theme={theme} />

      <button
        type="button"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="btn-apple-secondary fixed right-4 top-4 z-30 min-h-[36px] rounded-full px-4 py-1.5 text-xs font-semibold transition-all duration-200 active:scale-[0.97]"
        aria-label="Переключить тему"
      >
        {theme === "dark" ? "☀️ Светлая" : "🌙 Тёмная"}
      </button>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <AnimatePresence mode="wait">
          {(step === "hero" || step === "loading") && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex w-full max-w-4xl flex-col items-center gap-8"
            >
              <div className="space-y-4 text-center">
                <AnimatedTitle />
                <motion.p
                  className="theme-muted mx-auto max-w-xl text-lg font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  Введите дату и место — мы покажем, какая погода была в тот
                  день, и создадим атмосферу
                </motion.p>
              </div>
              <WeatherForm
                onSubmit={handleSubmit}
                isLoading={step === "loading"}
              />
            </motion.div>
          )}

          {step === "result" && weatherData && atmosphereResult && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex w-full flex-col items-center"
            >
              <WeatherCard
                data={weatherData}
                atmosphere={atmosphereResult}
                onSave={() => setShareOpen(true)}
                onReset={reset}
              />
            </motion.div>
          )}

          {step === "error" && (
            <motion.div
              key="error"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="surface-card max-w-md space-y-4 p-8 text-center"
            >
              <p className="text-4xl">🌫️</p>
              <h2 className="font-display theme-text text-2xl font-bold">
                Этот день ушёл в туман времени
              </h2>
              <p className="theme-muted">
                {errorMessage ??
                  "Не удалось найти данные. Попробуйте другую дату или место."}
              </p>
              <Button variant="secondary" onClick={reset}>
                Новый поиск
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {weatherData && atmosphereResult && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          data={weatherData}
          atmosphere={atmosphereResult}
        />
      )}
    </main>
  );
}
