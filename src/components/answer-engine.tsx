
'use client';

import React, { useState } from 'react';
import { usePresets } from '@/hooks/use-presets';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { Button } from './ui/button';
import { Bot, Loader2, Sparkles, Clipboard, Check, MessageCircleQuestion, RefreshCw } from 'lucide-react';
import type { Preset } from '@/lib/types';
import { generateAnswer } from '@/ai/flows/generate-answer';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Skeleton } from './ui/skeleton';

interface AnswerEngineProps {
    presetsHook: ReturnType<typeof usePresets>;
}

export function AnswerEngine({ presetsHook }: AnswerEngineProps) {
    const { presets, isLoaded } = presetsHook;
    const [selectedPreset, setSelectedPreset] = useState<Preset | null>(null);
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    const handleGenerateAnswer = async () => {
        if (!selectedPreset) {
            toast({
                variant: 'destructive',
                title: 'Pilih Preset',
                description: 'Anda harus memilih preset DNA brand terlebih dahulu.',
            });
            return;
        }
        if (!question.trim()) {
            toast({
                variant: 'destructive',
                title: 'Masukkan Pertanyaan',
                description: 'Anda harus memasukkan pertanyaan dari audiens.',
            });
            return;
        }

        setIsLoading(true);
        setGeneratedAnswer(null);
        try {
            const result = await generateAnswer({
                ...selectedPreset,
                question,
            });
            setGeneratedAnswer(result.answer);
        } catch(error) {
            console.error('Error generating answer:', error);
            toast({
                variant: 'destructive',
                title: 'Oops! Terjadi Kesalahan',
                description: 'Gagal membuat jawaban. Silakan coba lagi.',
              });
        } finally {
            setIsLoading(false);
        }
    }

    const handleSelectPreset = (presetId: string) => {
        const preset = presets.find(p => p.id === presetId) || null;
        setSelectedPreset(preset);
        setGeneratedAnswer(null);
    }
    
    const handleCopyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 2000);
        toast({
            title: 'Disalin!',
            description: 'Jawaban telah disalin ke clipboard.',
        });
    }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><MessageCircleQuestion /> Mesin Penjawab</CardTitle>
                <CardDescription>
                    Jawab pertanyaan audiens dengan gaya brand Anda. Pilih DNA Brand, masukkan pertanyaan, dan biarkan AI yang menjawab.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 <div>
                    <Label htmlFor="preset-select">Pilih DNA Brand</Label>
                    <Select
                        onValueChange={handleSelectPreset}
                        disabled={!isLoaded || presets.length === 0}
                        value={selectedPreset?.id || ''}
                    >
                        <SelectTrigger id="preset-select">
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
                <div>
                    <Label htmlFor="question-input">Pertanyaan Audiens</Label>
                    <Textarea
                        id="question-input"
                        placeholder="Contoh: Kak, produknya aman untuk ibu hamil nggak?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        disabled={!selectedPreset}
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleGenerateAnswer} disabled={!selectedPreset || !question || isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Sparkles className="mr-2 h-4 w-4" />
                    )}
                    Jawab Pertanyaan
                </Button>
            </CardFooter>
        </Card>

        {isLoading && (
            <Card>
                <CardHeader>
                    <CardTitle>Jawaban AI</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                </CardContent>
            </Card>
        )}

        {generatedAnswer && (
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Jawaban AI</CardTitle>
                    <div className='flex items-center gap-2'>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopyToClipboard(generatedAnswer)}
                            disabled={copied}
                        >
                            {copied ? <Check className="mr-2 h-4 w-4 text-green-500" /> : <Clipboard className="mr-2 h-4 w-4" />}
                            {copied ? 'Disalin' : 'Salin'}
                        </Button>
                         <Button
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateAnswer}
                            disabled={isLoading}
                        >
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Buat Variasi Lain
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                   <Textarea
                     value={generatedAnswer}
                     readOnly
                     rows={8}
                     className="text-base w-full h-full bg-muted/30"
                   />
                </CardContent>
            </Card>
        )}

        {!isLoading && !generatedAnswer && (
            <Card className="flex h-full flex-col items-center justify-center text-center min-h-[250px]">
                <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Bot className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">Jawaban Anda Menunggu</CardTitle>
                </CardHeader>
                <CardContent>
                <p className="text-muted-foreground">
                    Pilih preset, masukkan pertanyaan, dan klik 'Jawab Pertanyaan' untuk melihat keajaiban AI.
                </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
