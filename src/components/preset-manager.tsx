
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';
import { type Preset } from '@/lib/types';
import { presetNameSchema } from '@/lib/schemas';
import { Archive, Edit, Trash2, Upload, Copy, MoreVertical } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

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
    <Card className="bg-transparent text-sidebar-foreground shadow-none border-0 h-full">
      <CardHeader className="px-2 pt-0 pb-4">
        <CardTitle className="text-base text-white">Manajemen Preset</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[250px] -mx-2">
            <div className="px-2 space-y-2">
            {!isLoaded ? (
            <div className="space-y-2">
                <Skeleton className="h-12 w-full bg-sidebar-primary/20" />
                <Skeleton className="h-12 w-full bg-sidebar-primary/20" />
                <Skeleton className="h-12 w-full bg-sidebar-primary/20" />
            </div>
            ) : presets.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-sidebar-foreground/60 p-4 border-dashed border-2 border-sidebar-border rounded-lg h-[150px]">
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
            </div>
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
            "flex items-center justify-between rounded-lg border p-3 transition-colors",
            isActive 
                ? "bg-sidebar-accent/90 border-sidebar-accent text-sidebar-accent-foreground" 
                : "border-sidebar-border bg-sidebar-primary/20 hover:bg-sidebar-primary/30 text-white"
            )}>
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onLoad(preset)}>
                <p className="font-semibold truncate text-sm" title={preset.name}>{preset.name}</p>
            </div>
            <div className="flex items-center gap-0 ml-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-current">
                            <MoreVertical className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <RenamePresetDialog preset={preset} onUpdate={onUpdate}>
                             <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                <Edit className="mr-2 h-4 w-4" />
                                <span>Ubah Nama</span>
                            </DropdownMenuItem>
                        </RenamePresetDialog>
                        <DropdownMenuItem onClick={() => onDuplicate(preset.id)}>
                            <Copy className="mr-2 h-4 w-4" />
                            <span>Duplikat</span>
                        </DropdownMenuItem>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <DropdownMenuItem 
                                    className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                    onSelect={(e) => e.preventDefault()}
                                    >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    <span>Hapus</span>
                                </DropdownMenuItem>
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
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}

function RenamePresetDialog({ preset, onUpdate, children }: { preset: Preset, onUpdate: (preset: Preset) => void, children: React.ReactNode }) {
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
                {children}
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
