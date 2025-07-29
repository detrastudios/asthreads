
'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Preset, type BrandDna } from '@/lib/types';

const PRESETS_STORAGE_KEY = 'brand-persona-presets';

export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (storedPresets) {
        // Ensure loaded presets have unique IDs
        const parsedPresets = JSON.parse(storedPresets);
        const uniquePresets = Array.from(new Map(parsedPresets.map((p: Preset) => [p.id, p])).values()) as Preset[];
        setPresets(uniquePresets);
      }
    } catch (error) {
      console.error('Failed to load presets from local storage', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const savePresets = useCallback((newPresets: Preset[]) => {
    try {
      // Ensure no duplicates before saving
      const uniquePresets = Array.from(new Map(newPresets.map(p => [p.id, p])).values());
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(uniquePresets));
      setPresets(uniquePresets);
    } catch (error) {
      console.error('Failed to save presets to local storage', error);
    }
  }, []);

  const addPreset = useCallback((presetData: Omit<BrandDna, 'id'> & { name: string }) => {
    // Check for existing preset with the same name, and update it instead of adding a new one.
    const existingPreset = presets.find(p => p.name.toLowerCase() === presetData.name.toLowerCase());
    if (existingPreset) {
        const updatedPreset = { ...existingPreset, ...presetData };
        const newPresets = presets.map((p) =>
            p.id === updatedPreset.id ? updatedPreset : p
        );
        savePresets(newPresets);
        return;
    }

    const newPreset: Preset = {
      id: crypto.randomUUID(),
      ...presetData,
    };
    const newPresets = [...presets, newPreset];
    savePresets(newPresets);
  }, [presets, savePresets]);

  const updatePreset = useCallback((updatedPreset: Preset) => {
    const newPresets = presets.map((p) =>
      p.id === updatedPreset.id ? updatedPreset : p
    );
    savePresets(newPresets);
  }, [presets, savePresets]);

  const deletePreset = useCallback((presetId: string) => {
    const newPresets = presets.filter((p) => p.id !== presetId);
    savePresets(newPresets);
  }, [presets, savePresets]);

  return { presets, addPreset, updatePreset, deletePreset, isLoaded };
};
