
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from './ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { type Preset } from '@/lib/types';
import { presetNameSchema } from '@/lib/schemas';
import { Archive, Edit, Trash2, Upload, Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';

interface PresetManagerProps {
  presets: Preset[];
  isLoaded: boolean;
  activePresetId: string | null;
  onLoad: (preset: Preset) => void;
  onUpdate: (preset: Preset) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
}

export function PresetManager({ presets, isLoaded, activePresetId, onLoad, onUpdate, onDelete, onDuplicate }: PresetManagerProps) {
  return (
    <Card className="bg-sidebar-background border-sidebar-border text-sidebar-foreground">
      <CardHeader className="px-2 pt-2">
        <CardTitle className="text-base font-semibold text-sidebar-foreground">Manajemen Preset</CardTitle>
      </CardHeader>
      <CardContent className="p-2 pt-0">
        <ScrollArea className="h-[200px] pr-2">
            {!isLoaded ? (
            <div className="space-y-3">
                <Skeleton className="h-10 w-full bg-sidebar-accent/20" />
                <Skeleton className="h-10 w-full bg-sidebar-accent/20" />
            </div>
            ) : presets.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-sidebar-foreground/70 p-4 border-dashed border-2 border-sidebar-border rounded-lg h-full">
                <Archive className="h-8 w-8 mb-2" />
                <p className="text-sm font-medium">Tidak Ada Preset</p>
                <p className="text-xs">Simpan konfigurasi untuk digunakan lagi nanti.</p>
            </div>
            ) : (
            <div className="space-y-2">
                {presets.map((preset) => (
                <PresetItem 
                    key={preset.id} 
                    preset={preset}
                    isActive={preset.id === activePresetId} 
                    onLoad={onLoad} 
                    onUpdate={onUpdate} 
                    onDelete={onDelete} 
                    onDuplicate={onDuplicate} 
                    />
                ))}
            </div>
            )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

interface PresetItemProps {
    preset: Preset;
    isActive: boolean;
    onLoad: (preset: Preset) => void;
    onUpdate: (preset: Preset) => void;
    onDelete: (id: string) => void;
    onDuplicate: (id: string) => void;
}

function PresetItem({ preset, isActive, onLoad, onUpdate, onDelete, onDuplicate }: PresetItemProps) {
    return (
        <div className={cn(
            "flex items-center justify-between gap-2 rounded-full border p-1 pr-2 transition-colors",
            isActive 
                ? "bg-sidebar-accent border-sidebar-accent text-sidebar-accent-foreground" 
                : "border-sidebar-primary bg-transparent text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}>
            <span className="font-medium truncate pl-3 text-sm" title={preset.name}>{preset.name}</span>
            <div className="flex items-center shrink-0">
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-current hover:bg-sidebar-primary/50" onClick={() => onLoad(preset)} title="Muat">
                    <Upload className="h-4 w-4" />
                </Button>
                
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-current hover:bg-sidebar-primary/50" onClick={() => onDuplicate(preset.id)} title="Duplikat">
                    <Copy className="h-4 w-4" />
                </Button>

                <RenamePresetDialog preset={preset} onUpdate={onUpdate} />

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive hover:bg-destructive/20" title="Hapus">
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle>
                            <AlertDialogDescription>
                                Tindakan ini tidak dapat diurungkan. Ini akan menghapus preset '{preset.name}' secara permanen.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(preset.id)}>Hapus</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

function RenamePresetDialog({ preset, onUpdate }: { preset: Preset, onUpdate: (preset: Preset) => void }) {
    const [open, setOpen] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
      } = useForm({
        resolver: zodResolver(presetNameSchema),
        defaultValues: { name: preset.name },
      });
    
    // Reset form when dialog opens with new preset data
    React.useEffect(() => {
        if (open) {
            reset({ name: preset.name });
        }
    }, [open, preset, reset]);

    const handleRename = (data: { name: string }) => {
        onUpdate({ ...preset, name: data.name });
        setOpen(false);
    }
    
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-current hover:bg-sidebar-primary/50" title="Ubah Nama">
                    <Edit className="h-4 w-4" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Ubah Nama Preset</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleRename)} id={`rename-preset-form-${preset.id}`}>
                    <Input {...register('name')} autoFocus />
                    {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name.message as string}</p>}
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Batal</Button>
                    </DialogClose>
                    <Button type="submit" form={`rename-preset-form-${preset.id}`}>Simpan</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
