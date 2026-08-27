export type AtmosphereType =
  | "neutral"
  | "clear"
  | "rain"
  | "snow"
  | "storm"
  | "fog"
  | "cloudy";

export type AppStep = "hero" | "loading" | "result" | "error";

export type ThemeMode = "dark" | "light";

export interface GeoLocation {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

export interface WeatherData {
  date: string;
  temperatureMax: number;
  temperatureMin: number;
  precipitation: number;
  rain: number;
  snowfall: number;
  windSpeed: number;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export interface AtmosphereResult {
  type: AtmosphereType;
  description: string;
  gradient: [string, string];
}

export interface GeocodingResponse {
  results?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    country: string;
    admin1?: string;
  }>;
}

export interface ArchiveResponse {
  daily?: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    rain_sum: number[];
    snowfall_sum: number[];
    windspeed_10m_max: number[];
  };
}
