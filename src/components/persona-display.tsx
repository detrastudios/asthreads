
'use client';

import type { Persona } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';
import { Lightbulb, Rows3, FileType2 } from 'lucide-react';

interface PersonaDisplayProps {
  persona: Persona | null;
  isLoading: boolean;
}

const GlassCard: React.FC<React.PropsWithChildren<{}>> = ({ children }) => (
  <div className="bg-card/60 backdrop-blur-lg rounded-xl border">{children}</div>
);

export function PersonaDisplay({ persona, isLoading }: PersonaDisplayProps) {
  if (isLoading) {
    return <PersonaDisplaySkeleton />;
  }

  if (!persona) {
    return (
      <Card className="flex h-full flex-col items-center justify-center text-center bg-card/80 backdrop-blur-lg min-h-64">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lightbulb className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="mt-4">Persona Anda Menanti</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Klik 'Buat Persona' untuk melihat keajaiban AI setelah mengisi formulir.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
        <h2 className="text-2xl font-bold text-foreground">Hasil Persona</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-card/80 backdrop-blur-lg">
                <CardHeader className='flex-row items-center gap-4'>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Lightbulb className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Gaya Komunikasi</CardTitle>
                        <CardDescription>Saran gaya komunikasi.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{persona.tone}</p>
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-lg">
                <CardHeader className='flex-row items-center gap-4'>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <Rows3 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Pilar Konten</CardTitle>
                        <CardDescription>Tema utama konten.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{persona.contentPillars}</p>
                </CardContent>
            </Card>

            <Card className="bg-card/80 backdrop-blur-lg">
                <CardHeader className='flex-row items-center gap-4'>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 shrink-0">
                        <FileType2 className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle>Jenis Konten</CardTitle>
                        <CardDescription>Format yang disarankan.</CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <p>{persona.contentTypes}</p>
                </CardContent>
            </Card>
            {persona.additionalInfoSuggestion && (
                <Card className="bg-accent/20 border-accent md:col-span-2">
                <CardHeader>
                    <CardTitle>💡 Saran Peningkatan</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-accent-foreground/80">
                    {persona.additionalInfoSuggestion}
                    </p>
                </CardContent>
                </Card>
            )}
        </div>
    </div>
  );
}

function PersonaDisplaySkeleton() {
  return (
    <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(3)].map((_, i) => (
                <Card key={i} className="bg-card/80 backdrop-blur-lg">
                    <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                    </CardHeader>
                    <CardContent className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                    </CardContent>
                </Card>
            ))}
      </div>
    </div>
  );
}
