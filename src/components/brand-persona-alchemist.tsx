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
import { WandSparkles, Bot, Menu, FilePlus, PieChart, Settings, LogOut, LucideProps } from 'lucide-react';
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


type BrandDnaFormData = z.infer<typeof brandDnaSchema>;
type ActiveView = 'brand-dna' | 'content-engine';

const KontenAIIcon = (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 3a9 9 0 0 0-9 9c0 4.97 4.03 9 9 9s9-4.03 9-9" />
      <path d="M12 3v1" />
      <path d="M12 20v1" />
      <path d="M20.66 7.34l-.71.71" />
      <path d="M4.05 16.95l-.71.71" />
      <path d="M12 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
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
        <div className='flex min-h-screen bg-sidebar'>
            <Sidebar className="border-r-0">
                <SidebarHeader className='p-4 py-8'>
                    <div className="flex flex-col items-center text-center gap-4">
                        <KontenAIIcon className="h-10 w-10 text-white" />
                        <h1 className="text-xl font-bold text-white tracking-widest">
                            KontenAI
                        </h1>
                    </div>
                </SidebarHeader>
                <SidebarContent className="p-4">
                    <SidebarMenu className="gap-2">
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={activeView === 'brand-dna'}
                                onClick={() => setActiveView('brand-dna')}
                                className="h-14 justify-start group"
                                >
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sidebar-primary/20 group-hover:bg-sidebar-primary/40 group-data-[active=true]:bg-sidebar-accent transition-colors duration-300">
                                    <PieChart className="h-6 w-6 text-sidebar-primary-foreground group-data-[active=true]:text-sidebar-accent-foreground transition-colors duration-300" />
                                </div>
                                <span className="text-base">DNA Brand</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton 
                                isActive={activeView === 'content-engine'}
                                onClick={() => setActiveView('content-engine')}
                                className="h-14 justify-start group"
                                >
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sidebar-primary/20 group-hover:bg-sidebar-primary/40 group-data-[active=true]:bg-sidebar-accent transition-colors duration-300">
                                <Bot className="h-6 w-6 text-sidebar-primary-foreground group-data-[active=true]:text-sidebar-accent-foreground transition-colors duration-300"/>
                                </div>
                                <span className="text-base">Mesin Konten</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                 <SidebarFooter className="p-4">
                    <SidebarMenu>
                         <SidebarMenuItem>
                            <SidebarMenuButton className="h-14 justify-start group">
                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-sidebar-primary/20 group-hover:bg-sidebar-primary/40 transition-colors duration-300">
                                <Settings className="h-6 w-6 text-sidebar-primary-foreground" />
                                </div>
                                <span className="text-base">Settings</span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>
            </Sidebar>
            <main className="flex-1 p-4 sm:p-6 lg:p-8 rounded-l-3xl bg-white dark:bg-zinc-900">
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
                    <div className="space-y-8">
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
