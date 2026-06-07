import { Calendar as CalendarIcon, PackagePlus, BarChart3 } from 'lucide-react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDashboardMetrics } from "./dashboard/hooks/useDashboardMetrics";
import { DashboardKPIGrid, DashboardKPIGridSkeleton } from './dashboard/components/DashboardKPIGrid';
import { ExpirationChart } from './dashboard/components/ExpirationChart';
import { PriorityAlerts } from './dashboard/components/PriorityAlerts';
import { getWeekNumber } from '@/lib/utils';
import { Button } from '@/components/ui/button';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Buenos días";
  if (hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

export default function DashboardHome() {
  const { kpis, chartData, alerts, isLoading } = useDashboardMetrics();
  const { userName } = useOutletContext<{ userName: string }>();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="space-y-6 p-2 md:p-0">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="h-7 w-48 bg-muted animate-pulse rounded mb-2" />
            <div className="h-4 w-72 bg-muted animate-pulse rounded" />
          </div>
        </div>
        <DashboardKPIGridSkeleton />
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="lg:col-span-2 h-[400px] bg-card animate-pulse rounded-lg border border-border" />
          <div className="h-[400px] bg-card animate-pulse rounded-lg border border-border" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {getGreeting()}, {userName?.split(' ')[0] || 'Usuario'}
          </h1>
          <p className="text-muted-foreground text-sm">
            Estado del inventario al {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/dashboard/productos')}>
            <PackagePlus className="h-4 w-4" />
            Registrar Entrada
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate('/dashboard/reportes')}>
            <BarChart3 className="h-4 w-4" />
            Ver Reportes
          </Button>
          <div className="flex items-center gap-2 text-sm font-medium bg-card px-3 py-1 rounded-full border shadow-sm text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>Semana {getWeekNumber(new Date())}</span>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <DashboardKPIGrid kpis={kpis} />

      {/* Alerts & Charts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <ExpirationChart data={chartData} />
        <PriorityAlerts alerts={alerts} />
      </div>
    </div>
  );
}
