
'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot } from "lucide-react";

export function ContentEngine() {
  return (
    <Card className="flex h-full flex-col items-center justify-center text-center bg-card/60 backdrop-blur-lg border min-h-[400px]">
        <CardHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Bot className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="mt-4">Mesin Konten Segera Hadir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Fitur ini sedang dalam pengembangan. Segera kembali untuk membuat konten!
          </p>
        </CardContent>
      </Card>
  );
}
