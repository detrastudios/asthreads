

'use client';

import React, { useEffect, useState } from 'react';
import type { usePresets } from '@/hooks/use-presets';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';
import type { Preset, GenerateContentIdeasOutput } from '@/lib/types';
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
  const [randomIdeas, setRandomIdeas] = useState<GenerateContentIdeasOutput | null>(null);
  const [randomPreset, setRandomPreset] = useState<Preset | null>(null);
  const [isLoadingIdeas, setIsLoadingIdeas] = useState(false);
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
    const generateRandomIdeas = async () => {
      if (isLoaded && presets.length > 0) {
        setIsLoadingIdeas(true);
        try {
          const selectedPreset = presets[Math.floor(Math.random() * presets.length)];
          setRandomPreset(selectedPreset);
          const ideas = await generateContentIdeas(selectedPreset);
          setRandomIdeas(ideas);
        } catch (error) {
          console.error('Failed to generate random content ideas', error);
          setRandomIdeas(null);
        } finally {
          setIsLoadingIdeas(false);
        }
      }
    };
    generateRandomIdeas();
  }, [isLoaded, presets]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{greeting}!</h1>
        <p className="text-muted-foreground">Selamat datang kembali, mari kita mulai membuat konten.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <WandSparkles className="text-primary" /> 
                        {randomPreset ? `Inspirasi Konten untuk ${randomPreset.name}` : 'Inspirasi Konten Hari Ini'}
                    </CardTitle>
                    <CardDescription>
                        Ide-ide segar yang dihasilkan AI khusus untuk salah satu brand Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingIdeas && <ContentIdeasSkeleton />}
                    {!isLoadingIdeas && randomIdeas && (
                        <div className="space-y-4">
                            {randomIdeas.contentPillars.slice(0, 2).map((pillar, pIndex) => (
                                <div key={pIndex}>
                                    <h3 className="font-semibold text-lg mb-2">{pillar.pillar}</h3>
                                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                                        {pillar.hooks.slice(0, 3).map((hook, hIndex) => (
                                            <li key={hIndex}>{hook}</li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                     {!isLoadingIdeas && !randomIdeas && presets.length > 0 &&(
                        <p className="text-muted-foreground">Gagal memuat inspirasi. Coba muat ulang halaman.</p>
                     )}
                </CardContent>
            </Card>
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


function ContentIdeasSkeleton() {
    return (
        <div className="space-y-4">
            {[...Array(2)].map((_, i) => (
                <div key={i} className="space-y-3">
                    <Skeleton className="h-6 w-1/2" />
                    <div className="space-y-2 pl-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                    </div>
                </div>
            ))}
        </div>
    )
}
