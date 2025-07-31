
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
import { Archive, Edit, Trash2, Upload, Copy, MoreVertical, PlusCircle } from 'lucide-react';
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
  onNew: () => void;
}

export function PresetManager({ presets, isLoaded, activePresetId, onLoad, onUpdate, onDelete, onDuplicate, onNew }: PresetManagerProps) {
  return (
    <div className="space-y-4">
        <h3 className="px-2 text-xs font-semibold uppercase text-sidebar-foreground tracking-wider">Integrations</h3>
        <div className="space-y-2">
        {!isLoaded ? (
        <div className="space-y-2 px-2">
            <Skeleton className="h-8 w-full bg-muted" />
            <Skeleton className="h-8 w-full bg-muted" />
        </div>
        ) : presets.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center text-sidebar-foreground/60 p-4 border-dashed border-2 border-sidebar-border rounded-lg h-[100px]">
            <Archive className="h-6 w-6 mb-1" />
            <p className="text-sm">No Presets</p>
        </div>
        ) : (
        <div className="space-y-1">
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
        <Button variant="ghost" className="w-full justify-start h-8 text-sidebar-foreground" onClick={onNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add new preset
        </Button>
        </div>
    </div>
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
        <div
            className={cn(
                "w-full justify-start h-8 font-normal flex items-center rounded-md group",
                isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "text-sidebar-foreground hover:bg-muted"
            )}
        >
            <button
                className="truncate flex-1 text-left px-2 h-full"
                onClick={() => onLoad(preset)}
            >
                {preset.name}
            </button>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn(
                            "h-6 w-6 shrink-0",
                            isActive ? "hover:bg-primary/80" : ""
                        )} 
                        onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <RenamePresetDialog preset={preset} onUpdate={onUpdate}>
                         <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                        </DropdownMenuItem>
                    </RenamePresetDialog>
                    <DropdownMenuItem onClick={() => onDuplicate(preset.id)}>
                        <Copy className="mr-2 h-4 w-4" />
                        <span>Duplicate</span>
                    </DropdownMenuItem>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <DropdownMenuItem 
                                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                onSelect={(e) => e.preventDefault()}
                                >
                                <Trash2 className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                            </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the '{preset.name}' preset.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => onDelete(preset.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DropdownMenuContent>
            </DropdownMenu>
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
                    <DialogTitle>Rename Preset</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleRename)} id={`rename-preset-form-${preset.id}`}>
                    <Input {...register('name')} autoFocus />
                    {errors.name && <p className="mt-2 text-sm text-destructive">{errors.name.message as string}</p>}
                </form>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline" type="button">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form={`rename-preset-form-${preset.id}`}>Save</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
