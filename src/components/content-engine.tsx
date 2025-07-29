
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
import { Bot, Loader2, Sparkles, Clipboard, Check, PencilRuler } from 'lucide-react';
import type { Preset, GenerateContentIdeasOutput, GenerateThreadScriptOutput } from '@/lib/types';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';
import { generateThreadScript } from '@/ai/flows/generate-thread-script';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Skeleton } from './ui/skeleton';
import { Slider } from './ui/slider';

interface ContentEngineProps {
    presetsHook: ReturnType<typeof usePresets>;
}

export function ContentEngine({ presetsHook }: ContentEngineProps) {
    const { presets, isLoaded } = presetsHook;
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    const [contentIdeas, setContentIdeas] = useState<GenerateContentIdeasOutput | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const [generatedScripts, setGeneratedScripts] = useState<GenerateThreadScriptOutput[]>([]);
    const [variantCount, setVariantCount] = useState([1]);
    const { toast } = useToast();
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({});

    const handleGenerateIdeas = async () => {
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
        setSelectedIdea(null);
        setGeneratedScripts([]);
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

    const handleGenerateScript = async () => {
        if (!selectedIdea) {
            toast({
                variant: 'destructive',
                title: 'Pilih Ide',
                description: 'Anda harus memilih satu ide konten terlebih dahulu.',
            });
            return;
        }
        setIsScriptLoading(true);
        setGeneratedScripts([]);
        try {
            const promises = Array.from({ length: variantCount[0] }, () => 
                generateThreadScript({ idea: selectedIdea })
            );
            const results = await Promise.all(promises);
            setGeneratedScripts(results);
        } catch(error) {
            console.error('Error generating thread script:', error);
            toast({
                variant: 'destructive',
                title: 'Oops! Terjadi Kesalahan',
                description: 'Gagal membuat naskah utas. Silakan coba lagi.',
              });
        } finally {
            setIsScriptLoading(false);
        }
    }

    const handleSelectPreset = (presetId: string) => {
        const preset = presets.find(p => p.id === presetId) || null;
        setSelectedPreset(preset);
        setContentIdeas(null);
        setSelectedIdea(null);
        setGeneratedScripts([]);
    }
    
    const handleCopyToClipboard = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedStates(prev => ({ ...prev, [id]: true }));
        setTimeout(() => {
            setCopiedStates(prev => ({ ...prev, [id]: false }));
        }, 2000);
        toast({
            title: 'Disalin!',
            description: 'Teks telah disalin ke clipboard.',
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
                <Button onClick={handleGenerateIdeas} disabled={!selectedPreset || isLoading} size="lg">
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
            <>
            <Card className="bg-card/60 backdrop-blur-lg border">
                <CardHeader>
                    <CardTitle>Pilar & Ide Konten Anda</CardTitle>
                    <CardDescription>
                        Pilih salah satu ide di bawah ini untuk diubah menjadi naskah utas Threads.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup onValueChange={setSelectedIdea} value={selectedIdea || ''}>
                        <Accordion type="single" collapsible className="w-full">
                            {contentIdeas.contentPillars.map((pillar, pIndex) => (
                                <AccordionItem value={`item-${pIndex}`} key={pIndex}>
                                    <AccordionTrigger className="text-lg font-semibold">{`Pilar ${pIndex + 1}: ${pillar.pillar}`}</AccordionTrigger>
                                    <AccordionContent>
                                        <ul className="space-y-3 mt-2">
                                            {pillar.hooks.map((hook, hIndex) => (
                                                <li key={hIndex} className="flex items-center gap-3">
                                                    <RadioGroupItem value={hook} id={`hook-${pIndex}-${hIndex}`} />
                                                    <Label htmlFor={`hook-${pIndex}-${hIndex}`} className="flex-1 font-normal cursor-pointer">{hook}</Label>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon" 
                                                        onClick={(e) => { e.stopPropagation(); handleCopyToClipboard(hook, `hook-${pIndex}-${hIndex}`)}}
                                                        title="Salin"
                                                    >
                                                    {copiedStates[`hook-${pIndex}-${hIndex}`] ? <Check className="h-4 w-4 text-green-500" /> : <Clipboard className="h-4 w-4" />}
                                                    </Button>
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card className="bg-card/60 backdrop-blur-lg border">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PencilRuler /> Ubah Ide Jadi Utas</CardTitle>
                    <CardDescription>
                        Ubah satu ide simpel jadi sebuah utas yang bikin orang scroll sampe abis. Pilih ide di atas, lalu klik tombol di bawah.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedIdea && (
                        <div className="p-4 bg-muted/50 rounded-md border">
                            <p className="font-semibold">Ide Terpilih:</p>
                            <p className="text-muted-foreground">{selectedIdea}</p>
                        </div>
                    )}
                     <div className="space-y-3">
                        <Label>Jumlah Variasi Naskah ({variantCount[0]})</Label>
                        <Slider
                            defaultValue={variantCount}
                            onValueChange={setVariantCount}
                            min={1}
                            max={10}
                            step={1}
                            disabled={!selectedIdea || isScriptLoading || isLoading}
                        />
                    </div>
                    <Button onClick={handleGenerateScript} disabled={!selectedIdea || isScriptLoading || isLoading}>
                        {isScriptLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Buat Naskah Utas
                    </Button>

                    {isScriptLoading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                           <Skeleton className="h-64 w-full" />
                           <Skeleton className="h-64 w-full" />
                        </div>
                    )}

                    {generatedScripts.length > 0 && (
                         <div className="space-y-4 pt-4">
                            <h3 className="text-lg font-semibold">Hasil Naskah Utas:</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {generatedScripts.map((script, index) => (
                                    <div key={index} className="space-y-2 border p-4 rounded-lg bg-muted/20">
                                        <div className="flex justify-between items-center">
                                            <Label htmlFor={`thread-script-output-${index}`} className="font-semibold">Variasi {index + 1}</Label>
                                            <Button 
                                                variant="ghost" 
                                                size="sm" 
                                                onClick={() => handleCopyToClipboard(script.thread.join('\n\n'), `full-thread-${index}`)}
                                                title="Salin Naskah"
                                            >
                                                {copiedStates[`full-thread-${index}`] ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
                                                Salin
                                            </Button>
                                        </div>
                                        <Textarea 
                                            id={`thread-script-output-${index}`}
                                            value={script.thread.join('\n\n')} 
                                            readOnly 
                                            rows={script.thread.length * 3}
                                            className="text-base" 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
            </>
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
