import { TrendingDown, ShoppingBag, PieChart as PieIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ReportsKPIsProps {
  stats: {
    totalWaste: number;
    totalRecovered: number;
    topCategory: string;
  };
}

export function ReportsKPIs({ stats }: ReportsKPIsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* KPI 1: Real Waste */}
      <Card className="border-red-100 bg-red-50/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-red-900">Mermas Totales</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-700">{stats.totalWaste}</div>
          <p className="text-xs text-red-600/80">Piezas perdidas (No programa)</p>
        </CardContent>
      </Card>
      
      {/* KPI 2: Recovered */}
      <Card className="border-green-100 bg-green-50/30">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-green-900">Recuperados en Rebaja</CardTitle>
          <ShoppingBag className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-700">{stats.totalRecovered}</div>
          <p className="text-xs text-green-600/80">Piezas vendidas con descuento</p>
        </CardContent>
      </Card>

      {/* KPI 3: Focus */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Mayor Foco de Salida</CardTitle>
          <PieIcon className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold truncate">{stats.topCategory}</div>
          <p className="text-xs text-muted-foreground">Categoría con más movimiento</p>
        </CardContent>
      </Card>
    </div>
  );
}