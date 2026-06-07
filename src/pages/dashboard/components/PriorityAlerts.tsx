import { AlertCircle, AlertTriangle, Tag, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';

export function PriorityAlerts({ alerts }: { alerts: any[] }) {
  return (
    <Card className="col-span-3 lg:col-span-1 border-border shadow-sm flex flex-col h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
            Alertas Operativas
            {alerts.length > 0 && <Badge variant="destructive" className="rounded-full px-2 h-5 text-[10px]">{alerts.length}</Badge>}
        </CardTitle>
        <CardDescription className="text-xs">Priorizadas por urgencia y reglas de negocio</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-3">
          {alerts.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Todo en orden"
                description="No hay alertas operativas en este momento."
              />
          ) : alerts.map((alert, idx) => (
            <div
                key={idx}
                className={`flex gap-3 p-3 rounded-lg border text-sm transition-colors ${
                    alert.type === 'expired'
                    ? 'bg-red-50 border-red-100 dark:bg-red-500/10 dark:border-red-500/20'
                    : alert.type === 'risk'
                    ? 'bg-orange-50 border-orange-100 dark:bg-orange-500/10 dark:border-orange-500/20'
                    : 'bg-blue-50 border-blue-100 dark:bg-blue-500/10 dark:border-blue-500/20'
                }`}
            >
              <div className="flex-shrink-0 mt-1">
                {alert.type === 'expired' && <AlertCircle className="h-4 w-4 text-red-600" />}
                {alert.type === 'risk' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                {alert.type === 'discount' && <Tag className="h-4 w-4 text-blue-600" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-foreground truncate pr-2">{alert.product}</p>
                    <Badge variant={alert.type === 'expired' ? 'destructive' : 'outline'} className="text-[10px] h-5 px-1 shrink-0 bg-card/50 border-0">
                        {alert.days < 0 ? 'VENCIDO' : `${alert.days} DÍAS`}
                    </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-2">{alert.detail} • <span className="font-bold text-foreground/90">{alert.quantity} pcs</span></p>

                <div className={`text-xs font-medium px-2 py-1 rounded w-fit ${
                    alert.type === 'expired' ? 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300' :
                    alert.type === 'risk' ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300' :
                    'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300'
                }`}>
                    {alert.action}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
