
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
import { PresetManager } from './preset-manager';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { WandSparkles, Bot } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContentEngine } from './content-engine';


type BrandDnaFormData = z.infer<typeof brandDnaSchema>;

export function BrandPersonaAlchemist() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const presetsHook = usePresets();
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const formMethods = useForm<BrandDnaFormData>({
    resolver: zodResolver(brandDnaSchema),
    defaultValues: {
      targetAudience: '',
      painPoints: '',
      solutions: '',
      values: '',
      contentStyle: [],
      contentTone: [],
      platforms: [],
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

  const handleNewForm = () => {
    formMethods.reset({
      targetAudience: '',
      painPoints: '',
      solutions: '',
      values: '',
      contentStyle: [],
      contentTone: [],
      platforms: [],
      additionalInfo: '',
    });
    setPersona(null);
    setActivePresetId(null);
    toast({
      title: 'Formulir Baru',
      description: 'Formulir telah dibersihkan. Siap untuk ide baru!',
    });
  };


  return (
    <FormProvider {...formMethods}>
       <Tabs defaultValue="brand-dna">
      <div className="relative min-h-screen overflow-hidden p-4 sm:p-6 lg:p-8">
        <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
            <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
        </div>

        <header className="mx-auto max-w-7xl">
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className='flex items-center gap-3'>
                <WandSparkles className="h-9 w-9 text-primary" />
                <h1 className="font-headline text-3xl font-bold sm:text-4xl">
                  Alkemis Persona Brand
                </h1>
              </div>
              <p className="mt-1 text-muted-foreground">
                Bangun esensi brand Anda menjadi persona yang menarik dengan kekuatan AI.
              </p>
            </div>
            <div className="flex flex-col items-end gap-2 self-start">
                <ModeToggle />
                <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
                    <TabsTrigger value="brand-dna">
                        <WandSparkles className="mr-2 h-4 w-4" />
                        DNA Brand
                    </TabsTrigger>
                    <TabsTrigger value="content-engine">
                        <Bot className="mr-2 h-4 w-4" />
                        Mesin Konten
                    </TabsTrigger>
                </TabsList>
                 <Button variant="outline" onClick={handleNewForm}>Formulir Baru</Button>
            </div>
          </div>
        </header>

        <main className="mx-auto mt-8 max-w-7xl">
            <TabsContent value="brand-dna" className="mt-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
                    <div className="lg:col-span-3">
                        <BrandForm onGenerate={handleGenerate} onSave={handleSavePreset} isLoading={isLoading} />
                    </div>
                    <div className="flex flex-col gap-8 lg:col-span-2">
                        <PersonaDisplay persona={persona} isLoading={isLoading} />
                        <PresetManager
                        presets={presetsHook.presets}
                        isLoaded={presetsHook.isLoaded}
                        activePresetId={activePresetId}
                        onLoad={handleLoadPreset}
                        onUpdate={handleUpdatePreset}
                        onDelete={handleDeletePreset}
                        onDuplicate={handleDuplicatePreset}
                        />
                    </div>
                </div>
            </TabsContent>
            <TabsContent value="content-engine" className="mt-6">
                <ContentEngine presetsHook={presetsHook} />
            </TabsContent>
        </main>
      </div>
      </Tabs>
    </FormProvider>
  );
}
