
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
import { WandSparkles, Bot, LayoutDashboard, BrainCircuit, Menu } from 'lucide-react';
import { ContentEngine } from './content-engine';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
} from '@/components/ui/sidebar';


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
      niche: '',
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
    setActiveView('brand-dna');
    toast({
      title: 'Formulir Baru',
      description: 'Formulir telah dibersihkan. Siap untuk ide baru!',
    });
  };


  return (
    <FormProvider {...formMethods}>
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className='flex items-center gap-2'>
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20 shrink-0">
                            <WandSparkles className="h-6 w-6 text-primary-foreground" />
                        </div>
                        <h1 className="font-headline text-xl font-bold">
                            Asisten Ngonten
                        </h1>
                    </div>
                </SidebarHeader>
                <SidebarContent className="flex flex-col">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={activeView === 'brand-dna'}
                                onClick={() => setActiveView('brand-dna')}
                                >
                                <BrainCircuit />
                                DNA Brand
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={activeView === 'content-engine'}
                                onClick={() => setActiveView('content-engine')}
                                >
                                <Bot />
                                Mesin Konten
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                    <SidebarFooter className="mt-auto">
                        <PresetManager
                            presets={presetsHook.presets}
                            isLoaded={presetsHook.isLoaded}
                            activePresetId={activePresetId}
                            onLoad={handleLoadPreset}
                            onUpdate={handleUpdatePreset}
                            onDelete={handleDeletePreset}
                            onDuplicate={handleDuplicatePreset}
                            />
                    </SidebarFooter>
                </SidebarContent>
            </Sidebar>
            <SidebarInset>
                <div className="relative min-h-screen overflow-hidden p-4 sm:p-6 lg:p-8">
                    <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
                        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary/20 opacity-20 blur-[100px]"></div>
                    </div>
                    
                    <header className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <SidebarTrigger className="md:hidden">
                          <Menu />
                        </SidebarTrigger>
                        <h2 className="text-2xl font-bold">
                          {activeView === 'brand-dna' ? 'DNA Brand' : 'Mesin Konten'}
                        </h2>
                      </div>
                      <div className="flex items-center gap-4">
                        <Button variant="outline" onClick={handleNewForm}>Formulir Baru</Button>
                        <ModeToggle />
                      </div>
                    </header>

                    <main className="mt-8">
                    {activeView === 'brand-dna' ? (
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                            <div>
                                <BrandForm onGenerate={handleGenerate} onSave={handleSavePreset} isLoading={isLoading} />
                            </div>
                            <div className="flex flex-col gap-8">
                                <PersonaDisplay persona={persona} isLoading={isLoading} />
                            </div>
                        </div>
                    ) : (
                        <ContentEngine presetsHook={presetsHook} />
                    )}
                    </main>
                </div>
            </SidebarInset>
        </SidebarProvider>
    </FormProvider>
  );
}
