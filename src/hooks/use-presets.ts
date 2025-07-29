
'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Preset, type BrandDna } from '@/lib/types';

const PRESETS_STORAGE_KEY = 'brand-persona-presets';

type PresetData = Omit<Preset, 'id'>;

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

  const addPreset = useCallback((presetData: Omit<BrandDna, 'id'> & { name: string }) => {
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

    