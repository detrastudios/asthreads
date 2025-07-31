
'use client';

import React, { useEffect, useState } from 'react';
import type { usePresets } from '@/hooks/use-presets';
import { generateBrandPersona } from '@/ai/flows/generate-brand-persona';
import type { Persona, Preset } from '@/lib/types';
import { PersonaDisplay } from './persona-display';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { BookUser, PlusCircle, WandSparkles } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { ScrollArea } from './ui/scroll-area';

interface DashboardProps {
  presetsHook: ReturnType<typeof usePresets>;
  onLoadPreset: (preset: Preset) => void;
}

export function Dashboard({ presetsHook, onLoadPreset }: DashboardProps) {
  const { presets, isLoaded } = presetsHook;
  const [randomPersona, setRandomPersona] = useState<Persona | null>(null);
  const [isLoadingPersona, setIsLoadingPersona] = useState(false);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) {
      setGreeting('Selamat Pagi');
    } else if (hours < 18) {
      setGreeting('Selamat Siang');
    } else {
      setGreeting('Selamat Malam');
    }
  }, []);

  useEffect(() => {
    const generateRandomPersona = async () => {
      if (isLoaded && presets.length > 0) {
        setIsLoadingPersona(true);
        try {
          const randomPreset = presets[Math.floor(Math.random() * presets.length)];
          const persona = await generateBrandPersona(randomPreset);
          setRandomPersona(persona);
        } catch (error) {
          console.error('Failed to generate random persona', error);
          setRandomPersona(null); // Clear on error
        } finally {
          setIsLoadingPersona(false);
        }
      }
    };
    generateRandomPersona();
  }, [isLoaded, presets]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}!</h1>
        <p className="text-muted-foreground">Selamat datang kembali, mari kita mulai membuat konten.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-6">
            <div className="sticky top-8">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <WandSparkles className="text-primary" /> Persona Hari Ini
                        </CardTitle>
                        <CardDescription>
                            Inspirasi persona acak dari salah satu preset Anda.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PersonaDisplay persona={randomPersona} isLoading={isLoadingPersona} />
                    </CardContent>
                </Card>
            </div>
        </div>
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle>Preset Anda</CardTitle>
              <CardDescription>Pilih preset untuk diedit atau membuat konten.</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col">
                {!isLoaded ? (
                    <div className="space-y-4">
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-24 w-full" />
                    </div>
                ) : presets.length > 0 ? (
                    <ScrollArea className="flex-grow pr-4 -mr-4">
                        <div className="space-y-4">
                            {presets.map(preset => (
                                <Card key={preset.id} className="hover:border-primary/50 transition-colors bg-background/50">
                                    <CardHeader className="pb-4">
                                        <CardTitle className="flex items-center gap-2 text-lg">
                                            <BookUser className="text-primary" /> {preset.name}
                                        </CardTitle>
                                        <CardDescription>{preset.niche}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button onClick={() => onLoadPreset(preset)} className="w-full">
                                            Buka & Edit
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="flex-grow flex flex-col items-center justify-center text-center p-8 border-dashed border-2 rounded-lg">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <PlusCircle className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="mt-4 font-semibold">Belum Ada Preset</h3>
                        <p className="text-muted-foreground mb-4 text-sm">
                            Mulai dengan membuat DNA brand pertama Anda.
                        </p>
                        <Button onClick={() => onLoadPreset({
                            id: '', name: '', niche: '', targetAudience: '', painPoints: '', solutions: '', values: '', contentStyle: [], contentTone: [], additionalInfo: ''
                        })}>
                           Buat DNA Brand Baru
                        </Button>
                    </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

    