"use client";

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T) => void, () => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const item = window.localStorage.getItem(key);
        if (item !== null) {
          setStoredValue(JSON.parse(item) as T);
        }
      }
    } catch {
      // If parsing fails, keep initial value
    } finally {
      setIsLoading(false);
    }
  }, [key]);

  const setValue = useCallback(
    (value: T) => {
      try {
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(value));
          setStoredValue(value);
        }
      } catch {
        // Ignore localStorage errors
      }
    },
    [key]
  );

  const clearValue = useCallback(() => {
    try {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
        setStoredValue(initialValue);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [key, initialValue]);

  return [storedValue, setValue, clearValue, isLoading];
}
