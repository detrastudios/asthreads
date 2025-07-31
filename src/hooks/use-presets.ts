
'use client';

import { useState, useEffect, useCallback } from 'react';
import { type Preset, type BrandDna, contentStyles, contentTones } from '@/lib/types';
import { brandDnaSchema } from '@/lib/schemas';

const PRESETS_STORAGE_KEY = 'brand-persona-presets';

// Helper function to sanitize checkbox data
const sanitizeArray = (data: any, validValues: readonly any[]): string[] => {
    if (Array.isArray(data)) {
        const validSet = new Set(validValues);
        return data.filter(item => validSet.has(item));
    }
    return [];
};
const sanitizeTones = (data: any, validTones: readonly any[]): string[] => {
    if (Array.isArray(data)) {
        const validNames = new Set(validTones.map(t => t.name));
        return data.filter(item => validNames.has(item));
    }
    return [];
}


export const usePresets = () => {
  const [presets, setPresets] = useState<Preset[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // localStorage is only available in the browser.
    // We can safely access it inside useEffect.
    try {
      const storedPresets = localStorage.getItem(PRESETS_STORAGE_KEY);
      if (storedPresets) {
        let parsedPresets = JSON.parse(storedPresets) as Preset[];
        
        const validatedPresets = parsedPresets.filter(p => {
            const result = brandDnaSchema.safeParse(p);
            return result.success;
        });

        const sanitizedPresets = validatedPresets.map(p => ({
          ...p,
          niche: p.niche || '',
          contentStyle: sanitizeArray(p.contentStyle, contentStyles),
          contentTone: sanitizeTones(p.contentTone, contentTones),
        }));

        const uniquePresets = Array.from(new Map(sanitizedPresets.map((p: Preset) => [p.id, p])).values()) as Preset[];
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
      const uniquePresets = Array.from(new Map(newPresets.map(p => [p.id, p])).values());
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(uniquePresets));
      setPresets(uniquePresets);
    } catch (error)
      {
      console.error('Failed to save presets to local storage', error);
    }
  }, []);

  const addPreset = useCallback((presetData: Omit<BrandDna, 'id'> & { name: string }): string | null => {
    const existingPreset = presets.find(p => p.name.toLowerCase() === presetData.name.toLowerCase());
    if (existingPreset) {
        const updatedPreset = { ...existingPreset, ...presetData };
        const newPresets = presets.map((p) =>
            p.id === updatedPreset.id ? updatedPreset : p
        );
        savePresets(newPresets);
        return existingPreset.id;
    }

    const newPreset: Preset = {
      id: crypto.randomUUID(),
      ...presetData,
    };
    const newPresets = [...presets, newPreset];
    savePresets(newPresets);
    return newPreset.id;
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

  const duplicatePreset = useCallback((presetId: string) => {
    const presetToDuplicate = presets.find((p) => p.id === presetId);
    if (!presetToDuplicate) return;

    let newName = `${presetToDuplicate.name} (Salinan)`;
    let i = 2;
    while (presets.some(p => p.name === newName)) {
        newName = `${presetToDuplicate.name} (Salinan ${i})`;
        i++;
    }

    const newPreset: Preset = {
        ...presetToDuplicate,
        id: crypto.randomUUID(),
        name: newName,
    };

    const newPresets = [...presets, newPreset];
    savePresets(newPresets);
  }, [presets, savePresets]);

  return { presets, addPreset, updatePreset, deletePreset, duplicatePreset, isLoaded };
};
