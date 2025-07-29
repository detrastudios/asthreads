
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
import { Bot, Loader2, Sparkles, Clipboard, Check, PencilRuler, Film, GalleryHorizontal, MessageSquare } from 'lucide-react';
import type { Preset, GenerateContentIdeasOutput, GenerateThreadScriptOutput, ContentFormat } from '@/lib/types';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';
import { generateThreadScript } from '@/ai/flows/generate-thread-script';
import { useToast } from '@/hooks/use-toast';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Skeleton } from './ui/skeleton';
import { Slider } from './ui/slider';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface ContentEngineProps {
    presetsHook: ReturnType<typeof usePresets>;
}

type GeneratedScriptState = {
    id: string;
    isLoading: boolean;
    formats: {
        Utas?: GenerateThreadScriptOutput;
        Carousel?: GenerateThreadScriptOutput;
        Reels?: GenerateThreadScriptOutput;
    };
    currentFormat: ContentFormat;
};


export function ContentEngine({ presetsHook }: ContentEngineProps) {
    const { presets, isLoaded } = presetsHook;
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isScriptLoading, setIsScriptLoading] = useState(false);
    const [contentIdeas, setContentIdeas] = useState<GenerateContentIdeasOutput | null>(null);
    const [selectedIdea, setSelectedIdea] = useState<string | null>(null);
    const [generatedScripts, setGeneratedScripts] = useState<GeneratedScriptState[]>([]);
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
                niche: selectedPreset.niche,
                targetAudience: selectedPreset.targetAudience,
                painPoints: selectedPreset.painPoints,
                solutions: selectedPreset.solutions,
                values: selectedPreset.values,
                additionalInfo: selectedPreset.additionalInfo
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
        
        const scriptPromises = Array.from({ length: variantCount[0] }, (_, i) => ({
            id: `script-${i}`,
            isLoading: true,
            formats: {},
            currentFormat: 'Utas' as ContentFormat,
        }));
        setGeneratedScripts(scriptPromises);

        try {
            const promises = Array.from({ length: variantCount[0] }, () => 
                generateThreadScript({ idea: selectedIdea, contentType: 'Utas' })
            );
            const results = await Promise.all(promises);
            
            setGeneratedScripts(results.map((result, i) => ({
                id: `script-${i}`,
                isLoading: false,
                formats: { Utas: result },
                currentFormat: 'Utas',
            })));

        } catch(error) {
            console.error('Error generating thread script:', error);
            toast({
                variant: 'destructive',
                title: 'Oops! Terjadi Kesalahan',
                description: 'Gagal membuat naskah. Silakan coba lagi.',
              });
            setGeneratedScripts([]);
        } finally {
            setIsScriptLoading(false);
        }
    }
    
    const handleFormatChange = async (scriptId: string, format: ContentFormat) => {
        const scriptIndex = generatedScripts.findIndex(s => s.id === scriptId);
        if (scriptIndex === -1 || !selectedIdea) return;
    
        const currentScript = generatedScripts[scriptIndex];
    
        // If the format is already generated or is the default 'Utas', just switch view
        if (format === 'Utas' || currentScript.formats[format]) {
            const newScripts = [...generatedScripts];
            newScripts[scriptIndex].currentFormat = format;
            setGeneratedScripts(newScripts);
            return;
        }
    
        // Set loading state for the specific card
        let newScripts = [...generatedScripts];
        newScripts[scriptIndex].isLoading = true;
        setGeneratedScripts(newScripts);
    
        try {
            const result = await generateThreadScript({ idea: selectedIdea, contentType: format });
            
            newScripts = [...generatedScripts]; // get latest state
            newScripts[scriptIndex] = {
                ...newScripts[scriptIndex],
                isLoading: false,
                currentFormat: format,
                formats: {
                    ...newScripts[scriptIndex].formats,
                    [format]: result,
                },
            };
            setGeneratedScripts(newScripts);
    
        } catch (error) {
            console.error(`Error generating ${format} script:`, error);
            toast({
                variant: 'destructive',
                title: 'Gagal Mengubah Format',
                description: `Tidak dapat mengubah naskah ke format ${format}.`,
            });
            newScripts = [...generatedScripts]; // get latest state
            newScripts[scriptIndex].isLoading = false; // reset loading state on error
            setGeneratedScripts(newScripts);
        }
    };

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
        <Card className="bg-card/80 backdrop-blur-lg">
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
            <Card className="bg-card/80 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle>Pilar & Ide Konten Anda</CardTitle>
                    <CardDescription>
                        Pilih salah satu ide di bawah ini untuk diubah menjadi naskah.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup onValueChange={setSelectedIdea} value={selectedIdea || ''}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                            {contentIdeas.contentPillars.map((pillar, pIndex) => (
                                <Accordion type="single" collapsible className="w-full" key={pIndex}>
                                <AccordionItem value={`item-${pIndex}`}>
                                    <AccordionTrigger className="text-lg font-semibold text-left">{`Pilar ${pIndex + 1}: ${pillar.pillar}`}</AccordionTrigger>
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
                                </Accordion>
                            ))}
                        </div>
                    </RadioGroup>
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><PencilRuler /> Ubah Ide Jadi Naskah</CardTitle>
                    <CardDescription>
                       Pilih ide di atas, tentukan jumlah variasinya, lalu klik tombol di bawah.
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
                            max={3}
                            step={1}
                            disabled={!selectedIdea || isScriptLoading || isLoading}
                        />
                        <p className="text-xs text-muted-foreground">Setiap variasi akan menggunakan kuota permintaan AI Anda.</p>
                    </div>
                    <Button onClick={handleGenerateScript} disabled={!selectedIdea || isScriptLoading || isLoading}>
                        {isScriptLoading ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Sparkles className="mr-2 h-4 w-4" />
                        )}
                        Buat Naskah
                    </Button>
                </CardContent>
            </Card>
            
            {(isScriptLoading || generatedScripts.length > 0) && (
                 <div className="space-y-6">
                    <h3 className="text-xl font-bold">Hasil Naskah:</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {generatedScripts.map((script) => (
                            <Card key={script.id} className="flex flex-col bg-card/80 backdrop-blur-lg">
                                <CardHeader>
                                    <div className="flex justify-between items-center">
                                       <CardTitle>Variasi {parseInt(script.id.split('-')[1]) + 1}</CardTitle>
                                       <TooltipProvider>
                                            <div className="flex items-center gap-1 rounded-full border p-1">
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant={script.currentFormat === 'Utas' ? 'default' : 'ghost'} onClick={() => handleFormatChange(script.id, 'Utas')} className="rounded-full">
                                                            <MessageSquare className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Utas (Threads)</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant={script.currentFormat === 'Carousel' ? 'default' : 'ghost'} onClick={() => handleFormatChange(script.id, 'Carousel')} className="rounded-full">
                                                            <GalleryHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Carousel (Instagram)</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button size="sm" variant={script.currentFormat === 'Reels' ? 'default' : 'ghost'} onClick={() => handleFormatChange(script.id, 'Reels')} className="rounded-full">
                                                            <Film className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Reels (Video)</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </div>
                                        </TooltipProvider>
                                    </div>
                                </CardHeader>
                                <CardContent className="flex-grow">
                                    {script.isLoading ? (
                                        <div className="space-y-2">
                                            <Skeleton className="h-20 w-full" />
                                            <Skeleton className="h-4 w-3/4" />
                                        </div>
                                    ) : (
                                       <div className="space-y-2">
                                            <div className="flex justify-between items-center">
                                                <Label htmlFor={`script-output-${script.id}`} className="font-semibold">{script.currentFormat}</Label>
                                                <Button 
                                                    variant="ghost" 
                                                    size="sm" 
                                                    onClick={() => {
                                                        const currentOutput = script.formats[script.currentFormat];
                                                        if (!currentOutput) return;
                                                        const textToCopy = Array.isArray(currentOutput.thread) ? currentOutput.thread.join('\n\n') : currentOutput.thread;
                                                        handleCopyToClipboard(textToCopy, `full-script-${script.id}`)
                                                    }}
                                                    title="Salin Naskah"
                                                >
                                                    {copiedStates[`full-script-${script.id}`] ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
                                                    Salin
                                                </Button>
                                            </div>
                                            <Textarea 
                                                id={`script-output-${script.id}`}
                                                value={(() => {
                                                    const output = script.formats[script.currentFormat];
                                                    if (!output) return "Klik tombol format untuk menghasilkan...";
                                                    return Array.isArray(output.thread) ? output.thread.join('\n\n') : output.thread;
                                                })()} 
                                                readOnly 
                                                rows={10}
                                                className="text-base w-full h-full"
                                            />
                                       </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            </>
        )}

        {!isLoading && !contentIdeas && (
            <Card className="flex h-full flex-col items-center justify-center text-center bg-card/80 backdrop-blur-lg min-h-[400px]">
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
        <Card className="bg-card/80 backdrop-blur-lg">
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
