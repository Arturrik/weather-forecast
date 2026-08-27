"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { GeoLocation, GeocodingResponse } from "../types/weather";

export function useGeocoding(query: string, debounceMs = 350) {
  const [results, setResults] = useState<GeoLocation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const requestIdRef = useRef(0);

  const search = useCallback(async (searchQuery: string) => {
    const trimmed = searchQuery.trim();

    if (trimmed.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    const currentId = ++requestIdRef.current;
    setIsLoading(true);
    setHasSearched(false);

    try {
      const params = new URLSearchParams({ name: trimmed });
      const response = await fetch(`/api/geocode?${params}`);

      if (currentId !== requestIdRef.current) return;

      if (!response.ok) throw new Error("Geocoding failed");

      const data: GeocodingResponse = await response.json();
      setResults(
        (data.results ?? []).map((item) => ({
          id: item.id,
          name: item.name,
          latitude: item.latitude,
          longitude: item.longitude,
          country: item.country,
          admin1: item.admin1,
        }))
      );
      setHasSearched(true);
    } catch {
      if (currentId === requestIdRef.current) {
        setResults([]);
        setHasSearched(true);
      }
    } finally {
      if (currentId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      void search(query);
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [query, debounceMs, search]);

  return { results, isLoading, hasSearched };
}
