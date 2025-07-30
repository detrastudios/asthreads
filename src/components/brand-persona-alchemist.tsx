
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
import { WandSparkles, Bot, BrainCircuit, Menu, LogOut, FilePlus } from 'lucide-react';
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
        <div className='flex min-h-screen'>
            <Sidebar>
                <SidebarHeader className='p-4'>
                    <h1 className="text-2xl font-bold text-primary">
                        Asisten Konten
                    </h1>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={activeView === 'brand-dna'}
                                onClick={() => setActiveView('brand-dna')}
                                className="text-base"
                                >
                                <BrainCircuit />
                                <span>DNA Brand</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={activeView === 'content-engine'}
                                onClick={() => setActiveView('content-engine')}
                                className="text-base"
                                >
                                <Bot />
                                <span>Mesin Konten</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className='p-4'>
                     <PresetManager
                        presets={presetsHook.presets}
                        isLoaded={presetsHook.isLoaded}
                        activePresetId={activePresetId}
                        onLoad={handleLoadPreset}
                        onUpdate={handleUpdatePreset}
                        onDelete={handleDeletePreset}
                        onDuplicate={handleDuplicatePreset}
                        />
                     <Button variant="ghost" className="justify-start text-base text-sidebar-foreground/80 mt-4">
                        <LogOut />
                        <span>Keluar</span>
                    </Button>
                </SidebarFooter>
            </Sidebar>
            <main className="flex-1 bg-background rounded-tl-3xl p-4 sm:p-6 lg:p-8 -ml-4">
                <header className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                    <SidebarTrigger className="md:hidden">
                        <Menu />
                    </SidebarTrigger>
                    <h2 className="text-2xl font-bold text-foreground">
                        {activeView === 'brand-dna' ? 'DNA Brand' : 'Mesin Konten'}
                    </h2>
                    </div>
                    <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={handleNewForm}>
                        <FilePlus className="mr-2" />
                        Formulir Baru
                    </Button>
                    <ModeToggle />
                    </div>
                </header>

                <div className="mt-8">
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
                </div>
            </main>
        </div>
      </SidebarProvider>
    </FormProvider>
  );
}
