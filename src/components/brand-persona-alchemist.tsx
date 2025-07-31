

'use client';

import React, { useState, useCallback } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useToast } from '@/hooks/use-toast';
import { usePresets } from '@/hooks/use-presets';
import { brandDnaSchema } from '@/lib/schemas';
import type { BrandDna, Persona, Preset, GenerateContentIdeasOutput, GeneratedScriptState, GenerateAnswerOutput } from '@/lib/types';
import { generateBrandPersona } from '@/ai/flows/generate-brand-persona';
import { BrandForm } from './brand-form';
import { PersonaDisplay } from './persona-display';
import { ModeToggle } from './mode-toggle';
import { Button } from './ui/button';
import { Bot, LayoutDashboard, Home, MessageCircleQuestion } from 'lucide-react';
import { ContentEngine } from './content-engine';
import { KontenAIIcon, PresetDropdown } from './preset-dropdown';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { Dashboard } from './dashboard';
import { AnswerEngine } from './answer-engine';
import { cn } from '@/lib/utils';


type BrandDnaFormData = z.infer<typeof brandDnaSchema>;
type ActiveView = 'dashboard' | 'brand-dna' | 'content-engine' | 'answer-engine';

export function BrandPersonaAlchemist() {
  const [persona, setPersona] = useState<Persona | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const presetsHook = usePresets();
  const [activePresetId, setActivePresetId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');

  // State for ContentEngine
  const [contentIdeas, setContentIdeas] = useState<GenerateContentIdeasOutput | null>(null);
  const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
  const [generatedScripts, setGeneratedScripts] = useState<GeneratedScriptState[]>([]);

  // State for AnswerEngine
  const [question, setQuestion] = useState('');
  const [generatedAnswer, setGeneratedAnswer] = useState<GenerateAnswerOutput | null>(null);


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

  const activePreset = presetsHook.presets.find(p => p.id === activePresetId) || null;

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
    const newPresetId = presetsHook.addPreset({ name, ...currentValues });
    if(newPresetId) {
        setActivePresetId(newPresetId);
        toast({
          title: 'Preset Disimpan!',
          description: `Preset '${name}' telah berhasil disimpan.`,
        });
    } else {
        toast({
            variant: 'default',
            title: 'Preset Diperbarui!',
            description: `Preset '${name}' telah berhasil diperbarui dengan nilai-nilai terbaru.`,
          });
    }
  };

  const handleLoadPreset = useCallback((preset: Preset) => {
    formMethods.reset(preset);
    setPersona(null);
    setActivePresetId(preset.id);
    setActiveView('brand-dna');
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
      setActiveView('brand-dna');
      toast({
        title: 'Preset Baru',
        description: 'Anda dapat mulai membuat preset baru.',
      });
  };

  const handleViewChange = (view: ActiveView) => {
    setActiveView(view);
  }

  const navItems = [
    { value: 'dashboard', label: 'Dashboard', icon: Home },
    { value: 'brand-dna', label: 'DNA Brand', icon: LayoutDashboard },
    { value: 'content-engine', label: 'Mesin Konten', icon: Bot },
    { value: 'answer-engine', label: 'Mesin Penjawab', icon: MessageCircleQuestion },
  ] as const;

  return (
    <FormProvider {...formMethods}>
        <div className='flex min-h-screen flex-col bg-background'>
            <header className="flex h-16 items-center justify-between border-b bg-card px-4 md:px-6 sticky top-0 z-50">
                <div className="flex items-center gap-2 md:w-1/3">
                   <KontenAIIcon className="h-7 w-7" />
                    <h1 className="text-xl font-bold text-foreground tracking-tight">
                        AsThreads
                    </h1>
                </div>
                <div className="hidden md:flex flex-1 justify-center">
                    <Tabs value={activeView} onValueChange={(value) => handleViewChange(value as ActiveView)} className='w-full max-w-md'>
                        <TabsList className='flex w-full'>
                            {navItems.map(item => (
                                <TabsTrigger key={item.value} value={item.value} className='flex-1'>
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.label}
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </Tabs>
                </div>
                <div className="flex items-center gap-4 justify-end md:w-1/3">
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
                {activeView === 'dashboard' ? (
                    <Dashboard presetsHook={presetsHook} onLoadPreset={handleLoadPreset} />
                ) : activeView === 'brand-dna' ? (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
                        <div className="lg:col-span-3">
                            <BrandForm onGenerate={handleGenerate} onSave={handleSavePreset} isLoading={isLoading} />
                        </div>
                        <div className="lg:col-span-2">
                            <PersonaDisplay persona={persona} isLoading={isLoading} />
                        </div>
                    </div>
                ) : activeView === 'content-engine' ? (
                    <ContentEngine 
                        activePreset={activePreset}
                        contentIdeas={contentIdeas}
                        setContentIdeas={setContentIdeas}
                        selectedIdea={selectedIdea}
                        setSelectedIdea={setSelectedIdea}
                        generatedScripts={generatedScripts}
                        setGeneratedScripts={setGeneratedScripts}
                    />
                ) : (
                    <AnswerEngine 
                        activePreset={activePreset} 
                        question={question}
                        setQuestion={setQuestion}
                        generatedAnswer={generatedAnswer}
                        setGeneratedAnswer={setGeneratedAnswer}
                    />
                )}
                </div>
            </main>
            <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card border-t">
                <div className="grid h-16 grid-cols-4">
                    {navItems.map(item => (
                    <Button
                        key={item.value}
                        variant="ghost"
                        className={cn(
                            "flex flex-col h-full justify-center rounded-none text-xs",
                            activeView === item.value ? "text-primary bg-primary/10" : "text-muted-foreground"
                        )}
                        onClick={() => handleViewChange(item.value as ActiveView)}
                    >
                        <item.icon className="h-5 w-5 mb-1" />
                        {item.label}
                    </Button>
                    ))}
                </div>
            </nav>
        </div>
    </FormProvider>
  );
}

    
