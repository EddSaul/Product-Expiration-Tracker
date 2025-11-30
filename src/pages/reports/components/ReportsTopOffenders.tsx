import { AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TopItem {
  name: string;
  quantity: number;
}

interface ReportsTopOffendersProps {
  data: TopItem[];
}

export function ReportsTopOffenders({ data }: ReportsTopOffendersProps) {
  return (
    <Card className="col-span-3 border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            Productos Críticos
        </CardTitle>
        <CardDescription>Artículos que generan más pérdida real.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
            {data.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground text-sm">
                    No hay mermas registradas.
                </div>
            ) : data.map((item, i) => (
                <div key={i} className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className="flex-shrink-0 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 font-bold text-slate-600 text-xs">
                            {i + 1}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                            <p className="text-sm font-medium leading-none truncate">{item.name}</p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Acumulado</p>
                        </div>
                    </div>
                    <Badge variant="outline" className="text-red-600 border-red-100 bg-red-50">
                        {item.quantity} pzas
                    </Badge>
                </div>
            ))}
        </div>
      </CardContent>
    </Card>
  );
}