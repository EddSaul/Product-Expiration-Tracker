import { AlertCircle, AlertTriangle, Tag, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Component that displays prioritized operational alerts
export function PriorityAlerts({ alerts }: { alerts: any[] }) {
  return (
    <Card className="col-span-3 lg:col-span-1 border-slate-200 shadow-sm flex flex-col h-[400px]">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
            Alertas Operativas
            {/* Show a destructive badge with the number of alerts when there are any */}
            {alerts.length > 0 && <Badge variant="destructive" className="rounded-full px-2 h-5 text-[10px]">{alerts.length}</Badge>}
        </CardTitle>
        <CardDescription className="text-xs">Priorizadas por urgencia y reglas de negocio</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-3">
          {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-8">
                  <CheckCircle2 className="h-10 w-10 text-green-100 mb-2" />
                  <p className="text-sm">Todo en orden</p>
              </div>
          ) : alerts.map((alert, idx) => (
            <div 
                key={idx} 
                className={`flex gap-3 p-3 rounded-lg border text-sm transition-colors ${
                    alert.type === 'expired' 
                    ? 'bg-red-50 border-red-100' 
                    : alert.type === 'risk'
                    ? 'bg-orange-50 border-orange-100'
                    : 'bg-blue-50 border-blue-100'
                }`}
            >
              <div className="flex-shrink-0 mt-1">
                {alert.type === 'expired' && <AlertCircle className="h-4 w-4 text-red-600" />}
                {alert.type === 'risk' && <AlertTriangle className="h-4 w-4 text-orange-600" />}
                {alert.type === 'discount' && <Tag className="h-4 w-4 text-blue-600" />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                    <p className="font-semibold text-gray-900 truncate pr-2">{alert.product}</p>
                    <Badge variant={alert.type === 'expired' ? 'destructive' : 'outline'} className="text-[10px] h-5 px-1 shrink-0 bg-white/50 border-0">
                        {alert.days < 0 ? 'VENCIDO' : `${alert.days} DÍAS`}
                    </Badge>
                </div>

                <p className="text-xs text-gray-500 mb-2">{alert.detail} • <span className="font-bold text-gray-700">{alert.quantity} pcs</span></p>

                <div className={`text-xs font-medium px-2 py-1 rounded w-fit ${
                    alert.type === 'expired' ? 'bg-red-100 text-red-700' :
                    alert.type === 'risk' ? 'bg-orange-100 text-orange-700' :
                    'bg-blue-100 text-blue-700'
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