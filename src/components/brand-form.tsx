
'use client';

import { useFormContext, useForm } from 'react-hook-form';
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
import { socialPlatforms, contentStyles, type BrandDna } from '@/lib/types';
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
import { zodResolver } from '@hookform/resolvers/zod';
  

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
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Gaya Konten</FormLabel>
                    <FormDescription>Pilih satu atau lebih gaya yang paling mewakili brand Anda.</FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {contentStyles.map((style) => (
                      <FormField
                        key={style}
                        control={form.control}
                        name="contentStyle"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={style}
                              className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 transition-colors has-[:checked]:bg-primary/10"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(style)}
                                  onCheckedChange={(checked) => {
                                    let newValue;
                                    if (checked) {
                                      newValue = [...(field.value || []), style];
                                    } else {
                                      newValue = field.value?.filter(
                                        (value) => value !== style
                                      );
                                    }
                                    field.onChange(newValue);
                                    form.trigger('contentStyle');
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">{style}</FormLabel>
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
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Platform Media Sosial</FormLabel>
                    <FormDescription>
                      Pilih di mana persona ini akan hidup.
                    </FormDescription>
                  </div>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {socialPlatforms.map((platform) => {
                      const Icon = platformIcons[platform];
                      return (
                        <FormField
                          key={platform}
                          control={form.control}
                          name="platforms"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={platform}
                                className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4 transition-colors has-[:checked]:bg-primary/10"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(platform)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([
                                            ...(field.value || []),
                                            platform,
                                          ])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== platform
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal flex items-center gap-2">
                                  <Icon className="h-5 w-5 text-muted-foreground" />
                                  {platform}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
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
