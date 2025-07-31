

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
import { WandSparkles, Bot, Menu, FilePlus, PieChart, Settings, LogOut, LucideProps, LayoutDashboard } from 'lucide-react';
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
import { Separator } from './ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';


type BrandDnaFormData = z.infer<typeof brandDnaSchema>;
type ActiveView = 'brand-dna' | 'content-engine';

const KontenAIIcon = (props: LucideProps) => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M13.8245 4.3099C14.0754 4.07722 14.0754 3.69068 13.8245 3.45799L12.0292 1.77799C11.7783 1.54531 11.3686 1.54531 11.1177 1.77799L2.14719 10.043C1.62425 10.5283 1.27273 11.1717 1.14443 11.884L0.211707 16.3316C0.0612143 17.1352 0.730118 17.8549 1.53039 17.7149L5.96252 16.8453C6.6718 16.7171 7.3129 16.3653 7.79685 15.842L13.8245 4.3099Z"
        fill="currentColor"
        className="text-primary"
      />
      <path
        d="M19.8528 4.3099C20.1037 4.07722 20.1037 3.69068 19.8528 3.45799L18.0575 1.77799C17.8066 1.54531 17.3969 1.54531 17.146 1.77799L8.17549 10.043C7.65255 10.5283 7.30103 11.1717 7.17273 11.884L6.24001 16.3316C6.08951 17.1352 6.75842 17.8549 7.55869 17.7149L11.9908 16.8453C12.7001 16.7171 13.3412 16.3653 13.8251 15.842L19.8528 4.3099Z"
        fill="currentColor"
        className="text-foreground/30"
        opacity={0.5}
      />
      <path
        d="M21.993 19.8822C21.993 20.4345 21.5453 20.8822 20.993 20.8822H8.99297C8.44068 20.8822 7.99297 20.4345 7.99297 19.8822C7.99297 19.3299 8.44068 18.8822 8.99297 18.8822H20.993C21.5453 18.8822 21.993 19.3299 21.993 19.8822Z"
        fill="currentColor"
        className="text-foreground/30"
        opacity={0.5}
      />
    </svg>
);


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
        title: 'Formulir Dibersihkan',
        description: 'Anda dapat mulai membuat preset baru.',
      });
  };


  return (
    <FormProvider {...formMethods}>
      <SidebarProvider>
        <div className='flex min-h-screen bg-background'>
            <Sidebar className="border-r bg-sidebar text-sidebar-foreground">
                <SidebarHeader className='p-4'>
                    <div className="flex items-center gap-2">
                       <KontenAIIcon className="h-7 w-7" />
                        <h1 className="text-xl font-bold text-foreground tracking-tight">
                            KontenAI
                        </h1>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-2 flex flex-col gap-4">
                    <div className="mt-auto">
                        <PresetManager 
                            presets={presetsHook.presets}
                            isLoaded={presetsHook.isLoaded}
                            activePresetId={activePresetId}
                            onLoad={handleLoadPreset}
                            onUpdate={handleUpdatePreset}
                            onDelete={handleDeletePreset}
                            onDuplicate={handleDuplicatePreset}
                            onNew={handleNewPreset}
                        />
                    </div>
                </SidebarContent>
            </Sidebar>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 rounded-l-2xl">
                <header className="flex items-center justify-between mb-8">
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
                    <div className="flex items-center gap-4">
                        <ModeToggle />
                    </div>
                </header>

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
      </SidebarProvider>
    </FormProvider>
  );
}
