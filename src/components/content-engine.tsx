
'use client';

import React, { useState } from 'react';
import { usePresets } from '@/hooks/use-presets';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from './ui/button';
import { Bot, Loader2, Sparkles, Clipboard, Check } from 'lucide-react';
import type { Preset, GenerateContentIdeasOutput } from '@/lib/types';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

interface ContentEngineProps {
    presetsHook: ReturnType<typeof usePresets>;
}

export function ContentEngine({ presetsHook }: ContentEngineProps) {
    const { presets, isLoaded } = presetsHook;
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [contentIdeas, setContentIdeas] = useState<GenerateContentIdeasOutput | null>(null);
    const { toast } = useToast();
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    const handleGenerate = async () => {
        if (!selectedPreset) {
            toast({
                variant: 'destructive',
                title: 'Pilih Preset',
                description: 'Anda harus memilih preset DNA brand terlebih dahulu.',
            });
            return;
        }
        setIsLoading(true);
        setContentIdeas(null);
        try {
            const result = await generateContentIdeas({
                targetAudience: selectedPreset.targetAudience,
                painPoints: selectedPreset.painPoints,
                solutions: selectedPreset.solutions,
                values: selectedPreset.values,
            });
            setContentIdeas(result);
        } catch(error) {
            console.error('Error generating content ideas:', error);
            toast({
                variant: 'destructive',
                title: 'Oops! Terjadi Kesalahan',
                description: 'Gagal membuat ide konten. Silakan coba lagi.',
              });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectPreset = (presetId: string) => {
        const preset = presets.find(p => p.id === presetId) || null;
        setSelectedPreset(preset);
        setContentIdeas(null); // Reset content ideas when preset changes
    }
    
    const handleCopyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [id]: false }));
        }, 2000);
        toast({
            title: 'Disalin!',
            description: 'Konten telah disalin ke clipboard.',
        });
    }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <Card className="bg-card/60 backdrop-blur-lg border">
            <CardHeader>
                <CardTitle>Mesin Konten</CardTitle>
                <CardDescription>
                    Biar kamu gak bakal pernah kehabisan ide lagi. Pilih DNA Brand yang sudah disimpan untuk memulai.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <Select
                        onValueChange={handleSelectPreset}
                        disabled={!isLoaded || presets.length === 0}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder={
                                !isLoaded ? "Memuat preset..." : "Pilih preset DNA brand"
                            } />
                        </SelectTrigger>
                        <SelectContent>
                            {presets.map(preset => (
                                <SelectItem key={preset.id} value={preset.id}>
                                    {preset.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
                <Button onClick={handleGenerate} disabled={!selectedPreset || isLoading} size="lg">
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Buat Ide Konten
                </Button>
            </CardContent>
        </Card>

        {isLoading && <ContentIdeasSkeleton />}

        {contentIdeas && (
            <Card className="bg-card/60 backdrop-blur-lg border">
                <CardHeader>
                    <CardTitle>Pilar & Ide Konten Anda</CardTitle>
                    <CardDescription>
                        Berikut adalah 4 pilar konten dengan masing-masing 5 ide hook/judul untuk brand Anda.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Accordion type="single" collapsible className="w-full">
                        {contentIdeas.contentPillars.map((pillar, pIndex) => (
                             <AccordionItem value={`item-${pIndex}`} key={pIndex}>
                                <AccordionTrigger className="text-lg font-semibold">{`Pilar ${pIndex + 1}: ${pillar.pillar}`}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-3 list-disc pl-5 mt-2">
                                        {pillar.hooks.map((hook, hIndex) => (
                                            <li key={hIndex} className="flex items-center justify-between gap-2">
                                                <span>{hook}</span>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    onClick={() => handleCopyToClipboard(hook, `${pIndex}-${hIndex}`)}
                                                    title="Salin"
                                                >
                                                   {copiedStates[`${pIndex}-${hIndex}`] ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                                                </Button>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        )}

        {!isLoading && !contentIdeas && (
            <Card className="flex h-full flex-col items-center justify-center text-center bg-card/60 backdrop-blur-lg border min-h-[400px]">
                <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Konten Anda Menunggu</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Pilih preset dan klik 'Buat Ide Konten' untuk melihat keajaiban AI.
                </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}

function ContentIdeasSkeleton() {
    return (
        <Card className="bg-card/60 backdrop-blur-lg border">
            <CardHeader>
                <div className="h-6 bg-muted rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse mt-2"></div>
            </CardHeader>
            <CardContent className="space-y-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="space-y-3 p-4 border rounded-md">
                        <div className="h-5 bg-muted rounded w-1/3 animate-pulse"></div>
                        <div className="space-y-2 pl-5">
                            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-full animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-4/5 animate-pulse"></div>
                            <div className="h-4 bg-muted rounded w-5/6 animate-pulse"></div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    )
}
