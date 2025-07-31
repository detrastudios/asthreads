

'use client';

import React, { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { usePresets } from '@/hooks/use-presets';
import { brandDnaSchema } from '@/lib/schemas';
import type { BrandDna, Persona, Preset } from '@/lib/types';
import { generateBrandPersona } from '@/ai/flows/generate-brand-persona';
import { BrandForm } from './brand-form';
import { PersonaDisplay } from './persona-display';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Bot, LayoutDashboard } from 'lucide-react';
import { ContentEngine } from './content-engine';
import { KontenAIIcon, PresetDropdown } from './preset-dropdown';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';


type BrandDnaFormData = z.infer<typeof brandDnaSchema>;
type ActiveView = 'brand-dna' | 'content-engine';

export function BrandPersonaAlchemist() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const presetsHook = usePresets();
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('brand-dna');

  const formMethods = useForm<BrandDnaFormData>({
    resolver: zodResolver(brandDnaSchema),
    defaultValues: {
      niche: '',
      targetAudience: '',
      painPoints: '',
      solutions: '',
      values: '',
      contentStyle: [],
      contentTone: [],
      additionalInfo: '',
    },
  });

  const handleGenerate = async (data: BrandDna) => {
    setIsLoading(true);
    setPersona(null);
    try {
      const result = await generateBrandPersona(data);
      setPersona(result);
      toast({
        title: 'Persona Dihasilkan!',
        description: 'Persona brand baru Anda telah berhasil dibuat.',
      });
    } catch (error) {
      console.error('Error generating persona:', error);
      toast({
        variant: 'destructive',
        title: 'Oops! Terjadi Kesalahan',
        description: 'Gagal membuat persona. Silakan coba lagi.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePreset = (name: string) => {
    const currentValues = formMethods.getValues();
    presetsHook.addPreset({ name, ...currentValues });
    toast({
      title: 'Preset Disimpan!',
      description: `Preset '${name}' telah berhasil disimpan.`,
    });
  };

  const handleLoadPreset = useCallback((preset: Preset) => {
    formMethods.reset(preset);
    setPersona(null);
    setActivePresetId(preset.id);
    toast({
      title: 'Preset Dimuat!',
      description: `Preset '${preset.name}' telah dimuat ke dalam formulir.`,
    });
  }, [formMethods, toast]);
  
  const handleUpdatePreset = useCallback((preset: Preset) => {
    presetsHook.updatePreset(preset);
     toast({
      title: 'Preset Diperbarui!',
      description: `Preset '${preset.name}' telah berhasil diperbarui.`,
    });
  }, [presetsHook, toast]);


  const handleDeletePreset = useCallback((presetId: string) => {
    presetsHook.deletePreset(presetId);
    if (activePresetId === presetId) {
        setActivePresetId(null);
        handleNewPreset();
    }
    toast({
      variant: 'destructive',
      title: 'Preset Dihapus!',
      description: 'Preset yang dipilih telah dihapus.',
    });
  }, [presetsHook, toast, activePresetId]);
  
  const handleDuplicatePreset = useCallback((presetId: string) => {
    presetsHook.duplicatePreset(presetId);
    toast({
        title: 'Preset Diduplikasi!',
        description: 'Preset telah berhasil disalin.',
    });
  }, [presetsHook, toast]);
  
  const handleNewPreset = () => {
    formMethods.reset({
        niche: '',
        targetAudience: '',
        painPoints: '',
        solutions: '',
        values: '',
        contentStyle: [],
        contentTone: [],
        additionalInfo: '',
      });
      setPersona(null);
      setActivePresetId(null);
      toast({
        title: 'Preset Baru',
        description: 'Anda dapat mulai membuat preset baru.',
      });
  };

  return (
    <FormProvider {...formMethods}>
        <div className='flex min-h-screen flex-col bg-background'>
            <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6">
                <div className="flex items-center gap-2">
                   <KontenAIIcon className="h-7 w-7" />
                    <h1 className="text-xl font-bold text-foreground tracking-tight">
                        KontenAI
                    </h1>
                </div>
                <div className="flex items-center gap-4">
                    <Tabs value={activeView} onValueChange={(value) => setActiveView(value as ActiveView)}>
                        <TabsList>
                            <TabsTrigger value="brand-dna">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                DNA Brand
                            </TabsTrigger>
                            <TabsTrigger value="content-engine">
                                <Bot className="mr-2 h-4 w-4" />
                                Mesin Konten
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                    <PresetDropdown
                        presets={presetsHook.presets}
                        isLoaded={presetsHook.isLoaded}
                        activePresetId={activePresetId}
                        onLoad={handleLoadPreset}
                        onUpdate={handleUpdatePreset}
                        onDelete={handleDeletePreset}
                        onDuplicate={handleDuplicatePreset}
                        onNew={handleNewPreset}
                    />
                    <ModeToggle />
                </div>
            </header>
            <main className="flex-1 p-4 sm:p-6 lg:p-8">
                <div>
                {activeView === 'brand-dna' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-3">
                            <BrandForm onGenerate={handleGenerate} onSave={handleSavePreset} isLoading={isLoading} />
                        </div>
                        <div className="lg:col-span-2">
                            <PersonaDisplay persona={persona} isLoading={isLoading} />
                        </div>
                    </div>
                ) : (
                    <ContentEngine presetsHook={presetsHook} />
                )}
                </div>
            </main>
        </div>
    </FormProvider>
  );
}
