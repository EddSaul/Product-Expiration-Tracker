import { useEffect, useState } from 'react';
import { supabase } from "@/config/supabaseClient";
import { Download, Calendar, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ReportsKPIs } from "./components/ReportsKPIs";
import { ReportsChart } from "./components/ReportsChart";
import { ReportsTopOffenders } from "./components/ReportsTopOffenders";

export default function ReportsPage() {
  const [isLoading, setIsLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalWaste: 0,      
    totalRecovered: 0,  
    topCategory: "N/A"
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [topOffenders, setTopOffenders] = useState<any[]>([]);

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    setIsLoading(true);
    try {
      const { data: removedItems, error } = await supabase
        .from('inventory_items')
        .select(`
          quantity,
          removed_at,
          product:products (
            name,
            category:product_categories (name),
            brand:product_brands (participates_in_program) 
          )
        `)
        .eq('is_removed', true)
        .order('removed_at', { ascending: false });

      if (error) throw error;

      if (removedItems) {
        let wasteQty = 0;
        let recoveredQty = 0;
        
        const categoryStats: Record<string, { waste: number, recovered: number }> = {};
        const productMap: Record<string, number> = {};

        removedItems.forEach(item => {
          const qty = item.quantity;
          const isRecovered = item.product?.brand?.participates_in_program;
          const catName = item.product?.category?.name || "Sin Categoría";

          if (!categoryStats[catName]) categoryStats[catName] = { waste: 0, recovered: 0 };

          if (isRecovered) {
            recoveredQty += qty;
            categoryStats[catName].recovered += qty;
          } else {
            wasteQty += qty;
            categoryStats[catName].waste += qty;
            const prodName = item.product?.name || "Desconocido";
            productMap[prodName] = (productMap[prodName] || 0) + qty;
          }
        });

        const chart = Object.keys(categoryStats).map(key => ({
          name: key,
          Mermas: categoryStats[key].waste,
          Recuperados: categoryStats[key].recovered,
          total: categoryStats[key].waste + categoryStats[key].recovered
        })).sort((a, b) => b.total - a.total).slice(0, 5);

        const offenders = Object.keys(productMap).map(key => ({
          name: key,
          quantity: productMap[key]
        })).sort((a, b) => b.quantity - a.quantity).slice(0, 5);

        setStats({
          totalWaste: wasteQty,
          totalRecovered: recoveredQty,
          topCategory: chart.length > 0 ? chart[0].name : "N/A"
        });
        setChartData(chart);
        setTopOffenders(offenders);
      }

    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    window.print(); 
  };

  if (isLoading) {
      return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-blue-500"/></div>;
  }

  return (
      <div className="space-y-6 p-6 print:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Reportes de Mermas</h2>
          <p className="text-muted-foreground">Análisis de pérdidas reales vs productos recuperados por rebaja.</p>
        </div>
        <div className="flex gap-2">
            <Button variant="outline" className="gap-2 text-xs md:text-sm">
                <Calendar className="w-4 h-4" /> Este Mes
            </Button>
            <Button onClick={handleExport} className="gap-2 bg-blue-600 hover:bg-blue-700 text-xs md:text-sm">
                <Download className="w-4 h-4" /> Imprimir / PDF
            </Button>
        </div>
      </div>

      <div className="hidden print:block mb-6">
        <h1 className="text-2xl font-bold">Reporte de Mermas y Recuperación</h1>
        <p className="text-sm text-gray-500">Generado el {new Date().toLocaleDateString()}</p>
      </div>

      {/* 1. KPI Cards */}
      <ReportsKPIs stats={stats} />

      {/* 2. Grid of Charts and Lists */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 break-inside-avoid">
        
        {/* Main Chart */}
        <ReportsChart data={chartData} />

        {/* Top Offenders List */}
        <ReportsTopOffenders data={topOffenders} />
        
      </div>
    </div>
  );
}