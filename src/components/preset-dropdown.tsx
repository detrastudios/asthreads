
'use client';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
} from '@/components/ui/dropdown-menu';
import { Button } from './ui/button';
import {
  Archive, Edit, Trash2, Copy, MoreVertical, PlusCircle, ChevronsUpDown, Check, LucideProps
} from 'lucide-react';
import { type Preset } from '@/lib/types';
import { presetNameSchema } from '@/lib/schemas';
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
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';

interface PresetDropdownProps {
  presets: Preset[];
  isLoaded: boolean;
  activePresetId: string | null;
  onLoad: (preset: Preset) => void;
  onUpdate: (preset: Preset) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onNew: () => void;
}

export function KontenAIIcon(props: LucideProps) {
    return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          {...props}
        >
          <path
            d="M13.8245 4.3099C14.0754 4.07722 14.0754 3.69068 13.8245 3.45799L12.0292 1.77799C11.7783 1.54531 11.3686 1.54531 11.1177 1.77799L2.14719 10.043C1.62425 10.5283 1.27273 11.1717 1.14443 11.884L0.211707 16.3316C0.0612143 17.1352 0.730118 17.8549 1.53039 17.7149L5.96252 16.8453C6.6718 16.7171 7.3129 16.3653 7.79685 15.842L13.8245 4.3099Z"
            fill="currentColor"
            className="text-primary"
          />
          <path
            d="M19.8528 4.3099C20.1037 4.07722 20.1037 3.69068 19.8528 3.45799L18.0575 1.77799C17.8066 1.54531 17.3969 1.54531 17.146 1.77799L8.17549 10.043C7.65255 10.5283 7.30103 11.1717 7.17273 11.884L6.24001 16.3316C6.08951 17.1352 6.75842 17.8549 7.55869 17.7149L11.9908 16.8453C12.7001 16.7171 13.3412 16.3653 13.8251 15.842L19.8528 4.3099Z"
            fill="currentColor"
            className="text-foreground/30"
            opacity={0.5}
          />
          <path
            d="M21.993 19.8822C21.993 20.4345 21.5453 20.8822 20.993 20.8822H8.99297C8.44068 20.8822 7.99297 20.4345 7.99297 19.8822C7.99297 19.3299 8.44068 18.8822 8.99297 18.8822H20.993C21.5453 18.8822 21.993 19.3299 21.993 19.8822Z"
            fill="currentColor"
            className="text-foreground/30"
            opacity={0.5}
          />
        </svg>
    );
}

export function PresetDropdown({
  presets,
  isLoaded,
  activePresetId,
  onLoad,
  onUpdate,
  onDelete,
  onDuplicate,
  onNew,
}: PresetDropdownProps) {
  const activePreset = presets.find(p => p.id === activePresetId);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-[200px] justify-between">
          {activePreset ? activePreset.name : 'Pilih Preset'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[200px]">
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={onNew}>
            <PlusCircle className="mr-2 h-4 w-4" />
            <span>Tambah Preset Baru</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Preset Tersimpan</DropdownMenuLabel>
          {!isLoaded ? (
            <div className="px-2">
                <Skeleton className="h-6 w-full" />
            </div>
          ) : presets.length === 0 ? (
            <p className="px-2 text-xs text-muted-foreground">Belum ada preset.</p>
          ) : (
            presets.map(preset => (
              <DropdownMenuItem key={preset.id} onSelect={() => onLoad(preset)} className="justify-between">
                <span className="truncate">{preset.name}</span>
                {activePresetId === preset.id && <Check className="h-4 w-4" />}
                 <PresetActions
                    preset={preset}
                    onUpdate={onUpdate}
                    onDelete={onDelete}
                    onDuplicate={onDuplicate}
                  >
                     <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 shrink-0 opacity-50 hover:opacity-100 data-[state=open]:opacity-100" 
                        onClick={(e) => e.stopPropagation()}>
                        <MoreVertical className="h-4 w-4" />
                    </Button>
                 </PresetActions>
              </DropdownMenuItem>
            ))
          )}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PresetActions({
    preset,
    onUpdate,
    onDelete,
    onDuplicate,
    children
}: {
    preset: Preset,
    onUpdate: (preset: Preset) => void,
    onDelete: (id: string) => void,
    onDuplicate: (id: string) => void,
    children: React.ReactNode
}) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
            <DropdownMenuPortal>
                <DropdownMenuContent align="end" sideOffset={8} onClick={(e) => e.stopPropagation()}>
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
            </DropdownMenuPortal>
        </DropdownMenu>
    )
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
