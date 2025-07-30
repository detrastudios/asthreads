
'use client';

import { useFormContext } from 'react-hook-form';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { socialPlatforms, contentStyles, type BrandDna, contentTones } from '@/lib/types';
import { brandDnaSchema, presetNameSchema } from '@/lib/schemas';
import { platformIcons } from './icons';
import { Loader2, Save, Sparkles, WandSparkles, ChevronDown } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
  } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
import { useState, useCallback } from 'react';
import { generateSolutionSuggestion } from '@/ai/flows/generate-solution-suggestion';
import { generateValuesSuggestion } from '@/ai/flows/generate-values-suggestion';
  

type BrandDnaFormData = z.infer<typeof brandDnaSchema>;

interface BrandFormProps {
  onGenerate: (data: BrandDna) => void;
  onSave: (name: string) => void;
  isLoading: boolean;
}

export function BrandForm({ onGenerate, onSave, isLoading }: BrandFormProps) {
  const form = useFormContext<BrandDnaFormData>();
  const [solutionSuggestion, setSolutionSuggestion] = useState<string | null>(null);
  const [isSuggestingSolution, setIsSuggestingSolution] = useState(false);
  const [valuesSuggestion, setValuesSuggestion] = useState<string | null>(null);
  const [isSuggestingValues, setIsSuggestingValues] = useState(false);

  const fetchSolutionSuggestion = useCallback(async () => {
    const { niche, targetAudience, painPoints } = form.getValues();
    if (painPoints && painPoints.length > 15 && niche && targetAudience) {
        setIsSuggestingSolution(true);
        setSolutionSuggestion(null);
        try {
            const result = await generateSolutionSuggestion({ niche, targetAudience, painPoint: painPoints });
            if (result && result.solution) {
                setSolutionSuggestion(result.solution);
            }
        } catch (error) {
            console.error("Error fetching solution suggestion:", error);
        } finally {
            setIsSuggestingSolution(false);
        }
    } else {
        setSolutionSuggestion(null);
    }
  }, [form]);

  const fetchValuesSuggestion = useCallback(async () => {
    const { niche, targetAudience, painPoints, solutions } = form.getValues();
    if (painPoints && painPoints.length > 15 && solutions && solutions.length > 15 && niche && targetAudience) {
        setIsSuggestingValues(true);
        setValuesSuggestion(null);
        try {
            const result = await generateValuesSuggestion({ niche, targetAudience, painPoint: painPoints, solution: solutions });
            if (result && result.values) {
                setValuesSuggestion(result.values);
            }
        } catch (error) {
            console.error("Error fetching values suggestion:", error);
        } finally {
            setIsSuggestingValues(false);
        }
    } else {
        setValuesSuggestion(null);
    }
  }, [form]);


  const onSubmit = (data: BrandDnaFormData) => {
    onGenerate(data);
  };

  const handleAcceptSuggestion = (field: 'solutions' | 'values', suggestion: string | null) => {
    if (suggestion) {
        const currentValue = form.getValues(field);
        let newValue = currentValue;
        
        if (currentValue && currentValue.trim().length > 0) {
            if (field === 'values') {
                const separator = currentValue.trim().endsWith(',') ? ' ' : ', ';
                newValue = `${currentValue}${separator}${suggestion}`;
            } else {
                 newValue = `${currentValue}\n\n${suggestion}`;
            }
        } else {
            newValue = suggestion;
        }

        form.setValue(field, newValue, { shouldValidate: true });
        
        if (field === 'solutions') setSolutionSuggestion(null);
        if (field === 'values') setValuesSuggestion(null);
    }
  }

  return (
    <Card className="bg-card/80 backdrop-blur-lg">
      <CardHeader>
        <CardTitle>DNA Brand Anda</CardTitle>
        <CardDescription>
          Definisikan elemen inti dari brand Anda untuk kami bangun menjadi persona.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <FormField
              control={form.control}
              name="niche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Niche/Produk</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Contoh: Fashion berkelanjutan, Kopi spesialti, Aplikasi produktivitas..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="targetAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audiens</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Profesional muda yang tertarik pada keberlanjutan..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="painPoints"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Masalah Utama</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Kesulitan menemukan produk ramah lingkungan yang stylish..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="solutions"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Solusi yang Ditawarkan</FormLabel>
                        <Button type="button" size="sm" variant="ghost" onClick={fetchSolutionSuggestion} disabled={isSuggestingSolution}>
                            {isSuggestingSolution ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className='h-4 w-4' />}
                            <span className="ml-2">Saran AI</span>
                        </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Kami menyediakan fashion berkelanjutan yang trendi dan terjangkau..."
                        {...field}
                      />
                    </FormControl>
                    {solutionSuggestion && (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-dashed">
                            <div>
                                <p className="text-sm font-medium flex items-center gap-2"><WandSparkles className='text-primary' /> Saran AI</p>
                                <p className="text-sm text-muted-foreground mt-1 mb-2">{solutionSuggestion}</p>
                                <Button type="button" size="sm" onClick={() => handleAcceptSuggestion('solutions', solutionSuggestion)}>Gunakan Saran Ini</Button>
                            </div>
                        </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Nilai-nilai Brand</FormLabel>
                        <Button type="button" size="sm" variant="ghost" onClick={fetchValuesSuggestion} disabled={isSuggestingValues}>
                            {isSuggestingValues ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className='h-4 w-4'/>}
                            <span className="ml-2">Saran AI</span>
                        </Button>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Keberlanjutan, transparansi, kualitas, komunitas..."
                        {...field}
                      />
                    </FormControl>
                    {valuesSuggestion && (
                        <div className="mt-2 p-3 bg-muted/50 rounded-lg border border-dashed">
                            <div>
                                <p className="text-sm font-medium flex items-center gap-2"><WandSparkles className='text-primary' /> Saran AI</p>
                                <p className="text-sm text-muted-foreground mt-1 mb-2">{valuesSuggestion}</p>
                                <Button type="button" size="sm" onClick={() => handleAcceptSuggestion('values', valuesSuggestion)}>Gunakan Saran Ini</Button>
                            </div>
                        </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="contentStyle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gaya Konten</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-full justify-between",
                            !field.value?.length && "text-muted-foreground"
                          )}
                        >
                          {field.value?.length > 0
                            ? `${field.value.length} dipilih`
                            : "Pilih gaya konten"}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <div className="p-2 space-y-1">
                        {contentStyles.map((item) => (
                          <FormItem key={item} className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent">
                             <FormControl>
                                <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    if (checked) {
                                        field.onChange([...currentValue, item]);
                                    } else {
                                        field.onChange(currentValue.filter((value) => value !== item));
                                    }
                                    }}
                                    id={`style-${item}`}
                                />
                             </FormControl>
                             <FormLabel htmlFor={`style-${item}`} className="font-normal flex-1 cursor-pointer">
                                {item}
                             </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tone Konten</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            'w-full justify-between',
                            !field.value?.length && 'text-muted-foreground'
                          )}
                        >
                          {field.value?.length > 0
                            ? `${field.value.length} dipilih`
                            : 'Pilih tone konten'}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0">
                      <div className="p-2 space-y-1">
                        {contentTones.map((item) => (
                          <FormItem
                            key={item.name}
                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-accent"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(item.name)}
                                onCheckedChange={(checked) => {
                                  const currentValue = Array.isArray(field.value) ? field.value : [];
                                  if (checked) {
                                    field.onChange([...currentValue, item.name]);
                                  } else {
                                    field.onChange(
                                      currentValue.filter(
                                        (value) => value !== item.name
                                      )
                                    );
                                  }
                                }}
                                id={`tone-${item.name}`}
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor={`tone-${item.name}`}
                              className="font-normal flex-1 cursor-pointer"
                            >
                              {item.name}
                            </FormLabel>
                          </FormItem>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
               <FormField
                control={form.control}
                name="additionalInfo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Informasi Tambahan (Opsional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Berikan detail produk, contoh audiens, atau permintaan khusus lainnya..."
                        {...field}
                      />
                    </FormControl>
                     <FormDescription>
                      Gunakan kolom ini untuk menjawab saran dari AI atau menambahkan detail lain.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="platforms"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Platform Media Sosial</FormLabel>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {socialPlatforms.map((platform) => {
                      const Icon = platformIcons[platform];
                      return (
                        <FormItem
                            key={platform}
                            className={cn(
                                "flex items-center justify-center rounded-md border h-10 px-0 py-0",
                                field.value?.includes(platform) ? "bg-primary/10" : ""
                            )}
                            >
                            <FormControl>
                                <Checkbox
                                checked={field.value?.includes(platform)}
                                onCheckedChange={(checked) => {
                                    const currentValue = Array.isArray(field.value) ? field.value : [];
                                    if (checked) {
                                    field.onChange([...currentValue, platform]);
                                    } else {
                                    field.onChange(
                                        currentValue.filter(
                                        (value) => value !== platform
                                        )
                                    );
                                    }
                                }}
                                className="hidden"
                                id={`platform-${platform}`}
                                />
                            </FormControl>
                            <FormLabel
                                htmlFor={`platform-${platform}`}
                                className="font-normal flex items-center justify-center m-0 cursor-pointer w-full h-full"
                                title={platform}
                            >
                                <Icon className="h-6 w-6 text-muted-foreground" />
                            </FormLabel>
                        </FormItem>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-between">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" type="button">
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Preset
                </Button>
              </DialogTrigger>
              <SavePresetDialog onSave={onSave} />
            </Dialog>

            <Button type="submit" disabled={isLoading} size="lg">
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Buat Persona
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

function SavePresetDialog({ onSave }: { onSave: (name: string) => void }) {
    const {
      register,
      handleSubmit,
      formState: { errors },
      reset,
    } = useForm({
      resolver: zodResolver(presetNameSchema),
    });
  
    const handleSave = (data: { name: string }) => {
      onSave(data.name);
      reset();
    };
  
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Simpan Preset</DialogTitle>
          <DialogDescription>
            Beri nama preset ini untuk digunakan kembali nanti.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleSave)} id="save-preset-form">
          <Input
            {...register('name')}
            placeholder="Contoh: Brand Fashion Berkelanjutan"
            autoFocus
          />
          {errors.name && (
            <p className="mt-2 text-sm text-destructive">{errors.name.message as string}</p>
          )}
        </form>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">Batal</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button type="submit" form="save-preset-form">Simpan</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    );
  }

    

    
