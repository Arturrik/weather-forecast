"use client";

import { useRef } from "react";
import { toPng } from "html-to-image";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/Button";
import type { AtmosphereResult, WeatherData } from "../types/weather";

interface ShareModalProps {
  open: boolean;
  onClose: () => void;
  data: WeatherData;
  atmosphere: AtmosphereResult;
}

export function ShareModal({
  open,
  onClose,
  data,
  atmosphere,
}: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const avgTemp = Math.round((data.temperatureMax + data.temperatureMin) / 2);

  const downloadImage = async () => {
    if (!cardRef.current) return;
    try {
      const dataUrl = await toPng(cardRef.current, {
        width: 1200,
        height: 630,
        pixelRatio: 2,
      });
      const link = document.createElement("a");
      link.download = `time-capsule-${data.city}-${data.date}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      alert("Не удалось создать изображение");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="surface-card max-w-lg space-y-4 p-6"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-display theme-text text-xl font-bold">
              Тайм-капсула готова
            </h3>
            <p className="theme-muted text-sm">
              Сохраните карточку 1200×630 для соцсетей
            </p>

            <div
              className="overflow-hidden rounded-xl border"
              style={{ borderColor: "var(--surface-border)" }}
            >
              <div className="relative h-48 overflow-hidden">
                <div
                  ref={cardRef}
                  className="absolute left-0 top-0 flex origin-top-left scale-[0.25] flex-col justify-between p-10"
                  style={{
                    width: 1200,
                    height: 630,
                    background: `linear-gradient(135deg, ${atmosphere.gradient[0]}22, #0B0F19 50%, ${atmosphere.gradient[1]}33)`,
                  }}
                >
                  <div>
                    <p className="text-sm uppercase tracking-[0.3em] text-white/50">
                      Погодный тайм-капсул
                    </p>
                    <h2 className="font-display mt-4 text-5xl font-bold text-white">
                      {data.city}
                    </h2>
                    <p className="mt-2 text-xl text-white/70">{data.date}</p>
                  </div>
                  <div className="flex items-end justify-between">
                    <p className="font-mono text-8xl font-bold tabular-nums text-white">
                      {avgTemp}°C
                    </p>
                    <p className="max-w-md text-right text-2xl text-white/80">
                      {atmosphere.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button className="flex-1" onClick={() => void downloadImage()}>
                Скачать PNG
              </Button>
              <Button variant="secondary" onClick={onClose}>
                Закрыть
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
