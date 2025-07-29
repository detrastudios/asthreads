'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Preset } from '@/lib/types';

const PRESETS_STORAGE_KEY = 'brand-persona-presets';

export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (storedPresets) {
        setPresets(JSON.parse(storedPresets));
      }
    } catch (error) {
      console.error('Failed to load presets from local storage', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const savePresets = useCallback((newPresets: Preset[]) => {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(newPresets));
      setPresets(newPresets);
    } catch (error) {
      console.error('Failed to save presets to local storage', error);
    }
  }, []);

  const addPreset = useCallback((preset: Preset) => {
    const newPresets = [...presets, preset];
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
