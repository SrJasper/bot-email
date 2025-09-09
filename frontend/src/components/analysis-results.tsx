"use client";

import * as React from "react";
import type { AnalysisState } from "@/app/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Smile,
  Frown,
  BookText,
  type LucideIcon,
} from "lucide-react";

function getCategoryInfo(category?: string) {
  switch (category?.toLowerCase()) {
    case "produtivo":
      return {
        Icon: Smile,
        className: "bg-positive text-positive-foreground border-transparent",
        label: "Produtivo",
      };
    case "improdutivo":
      return {
        Icon: Frown,
        className: "bg-destructive text-destructive-foreground border-transparent",
        label: "Improdutivo",
      };
    default:
      return {
        Icon: Frown,
        className: "bg-secondary text-secondary-foreground border-transparent",
        label: category || 'N/A',
      };
  }
}

export function AnalysisResults({ result }: { result: AnalysisState }) {
  const [isVisible, setIsVisible] = React.useState(false);
  const prevTimestamp = React.useRef(result.timestamp);
  
  const { Icon: CategoryIcon, className: categoryClassName, label: categoryLabel } = getCategoryInfo(result.category);

  React.useEffect(() => {
    if (result.timestamp && result.timestamp !== prevTimestamp.current) {
      setIsVisible(true);
      prevTimestamp.current = result.timestamp;
    }
  }, [result.timestamp]);
  
  if (!result.summary || !isVisible) {
    return null;
  }

  return (
    <div className="mt-12 w-full space-y-8 animate-in fade-in-0 duration-700">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 font-headline text-xl">
              <BookText className="h-6 w-6 text-primary" />
              <span>Sugestão de Resposta</span>
            </CardTitle>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                <CategoryIcon className="h-5 w-5" /> Categoria
              </span>
              <Badge className={`text-base font-bold ${categoryClassName}`}>
                {categoryLabel}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-base leading-relaxed text-foreground/90 whitespace-pre-wrap">
            {result.summary}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
