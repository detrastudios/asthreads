
'use client';

import React, { useState, useEffect } from 'react';
import { usePresets } from '@/hooks/use-presets';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Button } from './ui/button';
import { Bot, Loader2, Sparkles, Clipboard, Check, MessageCircleQuestion, RefreshCw, Info } from 'lucide-react';
import type { Preset } from '@/lib/types';
import { generateAnswer } from '@/ai/flows/generate-answer';
import { useToast } from '@/hooks/use-toast';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Skeleton } from './ui/skeleton';

interface AnswerEngineProps {
    activePreset: Preset | null;
}

export function AnswerEngine({ activePreset }: AnswerEngineProps) {
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [generatedAnswer, setGeneratedAnswer] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const { toast } = useToast();

    // Reset state when the active preset changes
    useEffect(() => {
        setQuestion('');
        setGeneratedAnswer(null);
        setIsLoading(false);
    }, [activePreset]);

    const handleGenerateAnswer = async () => {
        if (!activePreset) {
            toast({
                variant: 'destructive',
                title: 'Tidak Ada Preset Aktif',
                description: 'Anda harus memilih atau membuat preset DNA brand terlebih dahulu.',
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
                ...activePreset,
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
                    Jawab pertanyaan audiens dengan gaya brand Anda. Mesin ini akan otomatis menggunakan preset DNA Brand yang sedang aktif.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                 {activePreset ? (
                    <div className="p-3 bg-muted/50 rounded-md border border-dashed flex items-start gap-3">
                        <Info className="h-5 w-5 text-primary mt-1" />
                        <div>
                            <p className="font-semibold text-sm">Menggunakan DNA Brand:</p>
                            <p className="text-muted-foreground font-medium">{activePreset.name}</p>
                        </div>
                    </div>
                ) : (
                    <div className="p-3 bg-destructive/10 rounded-md border border-dashed border-destructive/30 flex items-start gap-3">
                        <Info className="h-5 w-5 text-destructive mt-1" />
                        <div>
                            <p className="font-semibold text-sm text-destructive">Tidak Ada Preset Aktif</p>
                            <p className="text-destructive/80">Silakan pilih preset dari dropdown di header atau buat yang baru di tab "DNA Brand".</p>
                        </div>
                    </div>
                )}
                <div>
                    <Label htmlFor="question-input">Pertanyaan Audiens</Label>
                    <Textarea
                        id="question-input"
                        placeholder="Contoh: Kak, produknya aman untuk ibu hamil nggak?"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        rows={3}
                        disabled={!activePreset}
                    />
                </div>
            </CardContent>
            <CardFooter>
                 <Button onClick={handleGenerateAnswer} disabled={!activePreset || !question || isLoading}>
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
                    <CardTitle>Jawaban AsThreads</CardTitle>
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
                    <CardTitle>Jawaban AsThreads</CardTitle>
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
                    {activePreset ? "Masukkan pertanyaan, dan klik 'Jawab Pertanyaan' untuk melihat keajaiban AI." : "Pilih preset DNA Brand untuk memulai."}
                </p>
                </CardContent>
            </Card>
        )}
    </div>
  );
}
