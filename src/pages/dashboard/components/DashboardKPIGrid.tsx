import { Package, AlertCircle, CheckCircle2, Tag } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DashboardKPIGrid({ kpis }: { kpis: any }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <KPICard
        title="Total en Piso"
        value={kpis.totalItems}
        sub="piezas registradas"
        icon={Package}
        iconColor="text-blue-500"
      />
      <KPICard
        title="Acción Requerida"
        value={kpis.actionRequired}
        sub="piezas para rebaja o retiro"
        icon={Tag}
        iconColor="text-amber-600"
        bgClass={kpis.actionRequired > 0 ? 'bg-amber-50/40 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/25' : ''}
        textClass="text-amber-700 dark:text-amber-400"
      />
      <KPICard
        title="Vencidos"
        value={kpis.expired}
        sub="requieren retiro inmediato"
        icon={AlertCircle}
        iconColor="text-red-600"
        bgClass={kpis.expired > 0 ? 'bg-red-50/40 border-red-200 dark:bg-red-500/10 dark:border-red-500/25' : ''}
        textClass="text-red-700 dark:text-red-400"
      />
      <KPICard
        title="Estado Óptimo"
        value={kpis.goodCondition}
        sub={`${kpis.totalItems > 0 ? Math.round((kpis.goodCondition / kpis.totalItems) * 100) : 0}% sin alertas`}
        icon={CheckCircle2}
        iconColor="text-green-500"
        textClass="text-green-700 dark:text-green-400"
      />
    </div>
  );
}

export function DashboardKPIGridSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="border-border shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-4 bg-muted animate-pulse rounded" />
          </CardHeader>
          <CardContent>
            <div className="h-7 w-16 bg-muted animate-pulse rounded mb-1" />
            <div className="h-3 w-28 bg-muted animate-pulse rounded" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function KPICard({ title, value, sub, icon: Icon, iconColor, bgClass = "", textClass = "" }: any) {
  return (
    <Card className={`border-border shadow-sm ${bgClass}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className={`text-sm font-medium ${textClass || 'text-muted-foreground'}`}>{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${textClass}`}>{value}</div>
        <p className={`text-xs ${textClass ? 'opacity-80' : 'text-muted-foreground'}`}>{sub}</p>
      </CardContent>
    </Card>
  );
}
