
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
            <h2 className="text-2xl font-bold text-foreground">Preset DNA Brand Anda</h2>
            {!isLoaded ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-32" />
                    <Skeleton className="h-32" />
                </div>
            ) : presets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {presets.map(preset => (
                        <Card key={preset.id} className="hover:border-primary/50 transition-colors">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
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
            ) : (
                <Card className="flex flex-col items-center justify-center text-center p-8">
                     <CardHeader>
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <PlusCircle className="h-6 w-6 text-primary" />
                        </div>
                        <CardTitle className="mt-4">Belum Ada Preset</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground mb-4">
                            Mulai dengan membuat DNA brand pertama Anda.
                        </p>
                        <Button onClick={() => onLoadPreset({
                            id: '', name: '', niche: '', targetAudience: '', painPoints: '', solutions: '', values: '', contentStyle: [], contentTone: [], additionalInfo: ''
                        })}>
                           Buat DNA Brand Baru
                        </Button>
                    </CardContent>
                </Card>
            )}
        </div>
        <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-8">
                <Card className="bg-card/80 backdrop-blur-lg">
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
      </div>
    </div>
  );
}
