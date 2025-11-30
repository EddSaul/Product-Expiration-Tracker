import { Loader2, Calendar as CalendarIcon } from 'lucide-react';
import { useDashboardMetrics } from "./dashboard/hooks/useDashboardMetrics";
import { DashboardKPIGrid } from './dashboard/components/DashboardKPIGrid';
import { ExpirationChart } from './dashboard/components/ExpirationChart';
import { PriorityAlerts } from './dashboard/components/PriorityAlerts';
import { getWeekNumber } from '@/lib/utils';

export default function DashboardHome() {
  const { kpis, chartData, alerts, isLoading } = useDashboardMetrics();

  if (isLoading) {
    return (
        <div className="flex h-96 items-center justify-center">
            <Loader2 className="animate-spin h-8 w-8 text-blue-500"/>
        </div>
    );
  }

  return (
    <div className="space-y-6 p-2 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Resumen General</h1>
          <p className="text-muted-foreground text-sm">
            Estado del inventario al {new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm font-medium bg-white px-3 py-1 rounded-full border shadow-sm text-gray-600">
          <CalendarIcon className="h-4 w-4" />
          <span>Semana {getWeekNumber(new Date())}</span>
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