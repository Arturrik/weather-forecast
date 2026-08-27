import { create } from "zustand";
import type {
  AppStep,
  AtmosphereType,
  GeoLocation,
  ThemeMode,
  WeatherData,
} from "../types/weather";

interface WeatherStore {
  step: AppStep;
  theme: ThemeMode;
  location: GeoLocation | null;
  date: string | null;
  weatherData: WeatherData | null;
  atmosphere: AtmosphereType;
  errorMessage: string | null;
  setStep: (step: AppStep) => void;
  setTheme: (theme: ThemeMode) => void;
  setLocation: (location: GeoLocation | null) => void;
  setDate: (date: string | null) => void;
  setWeatherData: (data: WeatherData | null) => void;
  setAtmosphere: (atmosphere: AtmosphereType) => void;
  setError: (message: string | null) => void;
  reset: () => void;
}

const initialState = {
  step: "hero" as AppStep,
  theme: "dark" as ThemeMode,
  location: null as GeoLocation | null,
  date: null as string | null,
  weatherData: null as WeatherData | null,
  atmosphere: "neutral" as AtmosphereType,
  errorMessage: null as string | null,
};

export const useWeatherStore = create<WeatherStore>((set) => ({
  ...initialState,
  setStep: (step) => set({ step }),
  setTheme: (theme) => set({ theme }),
  setLocation: (location) => set({ location }),
  setDate: (date) => set({ date }),
  setWeatherData: (weatherData) => set({ weatherData }),
  setAtmosphere: (atmosphere) => set({ atmosphere }),
  setError: (errorMessage) => set({ errorMessage }),
  reset: () => set({ ...initialState, theme: "dark" }),
}));
