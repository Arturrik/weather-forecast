"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { useGeocoding } from "../hooks/useGeocoding";
import type { GeoLocation } from "../types/weather";
import { cn } from "../lib/utils";

interface WeatherFormProps {
  onSubmit: (location: GeoLocation, date: string) => void;
  isLoading?: boolean;
}

const today = new Date().toISOString().split("T")[0];

export function WeatherForm({ onSubmit, isLoading }: WeatherFormProps) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<GeoLocation | null>(null);
  const [date, setDate] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { results, isLoading: isSearching, hasSearched } = useGeocoding(query);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!selected || !date) return;
    onSubmit(selected, date);
  };

  const selectLocation = (loc: GeoLocation) => {
    setSelected(loc);
    setQuery(`${loc.name}, ${loc.country}`);
    setShowSuggestions(false);
  };

  const showDropdown = showSuggestions && query.trim().length >= 2;

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="surface-card w-full max-w-lg space-y-4 p-6 md:p-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.6 }}
    >
      <div ref={containerRef} className="relative">
        <Input
          label="Место"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelected(null);
            setShowSuggestions(true);
          }}
          onFocus={() => setShowSuggestions(true)}
          autoComplete="off"
          required
        />
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-30 mt-2 max-h-52 w-full overflow-auto rounded-2xl border shadow-xl backdrop-blur-xl"
            style={{
              borderColor: "var(--surface-border)",
              backgroundColor: "var(--dropdown-bg)",
            }}
          >
            {isSearching && (
              <li className="theme-muted px-4 py-3 text-sm">Поиск...</li>
            )}
            {!isSearching && hasSearched && results.length === 0 && (
              <li className="theme-muted px-4 py-3 text-sm">
                Город не найден — попробуйте другое название
              </li>
            )}
            {results.map((loc) => (
              <li key={loc.id}>
                <button
                  type="button"
                  className={cn(
                    "theme-text w-full px-4 py-3 text-left text-sm transition hover:bg-black/5 dark:hover:bg-white/10",
                    selected?.id === loc.id && "bg-black/5 dark:bg-white/5"
                  )}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => selectLocation(loc)}
                >
                  {loc.name}
                  {loc.admin1 ? `, ${loc.admin1}` : ""}, {loc.country}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </div>

      <Input
        label="Дата"
        type="date"
        min="1940-01-01"
        max={today}
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />

      <Button type="submit" size="lg" disabled={!selected || !date || isLoading} className="w-full">
        {isLoading ? "Создаём тайм-капсулу..." : "Создать тайм-капсулу"}
      </Button>
    </motion.form>
  );
}
