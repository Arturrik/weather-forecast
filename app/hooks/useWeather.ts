"use client";

import { useCallback } from "react";
import type { ArchiveResponse, GeoLocation, WeatherData } from "../types/weather";

export function useWeather() {
  const fetchWeather = useCallback(
    async (location: GeoLocation, date: string): Promise<WeatherData> => {
      const params = new URLSearchParams({
        latitude: String(location.latitude),
        longitude: String(location.longitude),
        start_date: date,
        end_date: date,
        daily:
          "temperature_2m_max,temperature_2m_min,precipitation_sum,rain_sum,snowfall_sum,windspeed_10m_max",
        timezone: "auto",
      });

      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/archive?${params}`
      );

      if (!response.ok) {
        throw new Error("Не удалось получить погодные данные");
      }

      const data: ArchiveResponse = await response.json();
      const daily = data.daily;

      if (
        !daily?.time?.length ||
        daily.temperature_2m_max[0] == null
      ) {
        throw new Error("Этот день ушёл в туман времени");
      }

      return {
        date,
        temperatureMax: daily.temperature_2m_max[0],
        temperatureMin: daily.temperature_2m_min[0],
        precipitation: daily.precipitation_sum[0] ?? 0,
        rain: daily.rain_sum[0] ?? 0,
        snowfall: daily.snowfall_sum[0] ?? 0,
        windSpeed: daily.windspeed_10m_max[0] ?? 0,
        city: location.name,
        country: location.country,
        latitude: location.latitude,
        longitude: location.longitude,
      };
    },
    []
  );

  return { fetchWeather };
}
