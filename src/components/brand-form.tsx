
'use client';

import { useFormContext, Controller, useFieldArray } from 'react-hook-form';
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
import { Loader2, Save } from 'lucide-react';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn } from '@/lib/utils';
  

type BrandDnaFormData = z.infer<typeof brandDnaSchema>;

interface BrandFormProps {
  onGenerate: (data: BrandDna) => void;
  onSave: (name: string) => void;
  isLoading: boolean;
}

export function BrandForm({ onGenerate, onSave, isLoading }: BrandFormProps) {
  const form = useFormContext<BrandDnaFormData>();

  const onSubmit = (data: BrandDnaFormData) => {
    onGenerate(data);
  };

  return (
    <Card className="bg-card/60 backdrop-blur-lg border">
      <CardHeader>
        <CardTitle>DNA Brand Anda</CardTitle>
        <CardDescription>
          Definisikan elemen inti dari brand Anda untuk kami bangun menjadi persona.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
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
                    <FormLabel>Solusi yang Ditawarkan</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Kami menyediakan fashion berkelanjutan yang trendi dan terjangkau..."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="values"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nilai-nilai Brand</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Contoh: Keberlanjutan, transparansi, kualitas, komunitas..."
                        {...field}
                      />
                    </FormControl>
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
                  <div className="mb-4">
                    <FormLabel>Gaya Konten</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {contentStyles.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="contentStyle"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className={cn("flex flex-row items-center space-x-3 space-y-0 rounded-md border px-3 py-2 transition-colors", field.value?.includes(item) ? "bg-primary/10" : "")}
                            >
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
                              <FormLabel htmlFor={`style-${item}`} className="font-normal text-sm m-0">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="contentTone"
              render={({ field }) => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Tone Konten</FormLabel>
                  </div>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {contentTones.map((item) => (
                      <FormField
                        key={item}
                        control={form.control}
                        name="contentTone"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={item}
                              className={cn("flex flex-row items-center space-x-3 space-y-0 rounded-md border px-3 py-2 transition-colors", field.value?.includes(item) ? "bg-primary/10" : "")}
                            >
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
                                  id={`tone-${item}`}
                                />
                              </FormControl>
                              <FormLabel htmlFor={`tone-${item}`} className="font-normal text-sm m-0">
                                {item}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                  </div>
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

    








    

    