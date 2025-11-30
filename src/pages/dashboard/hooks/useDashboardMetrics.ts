import { useState, useEffect } from 'react';
import { supabase } from "@/config/supabaseClient";
import { calculateProductStatus } from "@/features/products/utils/statusHelpers";

export function useDashboardMetrics() {
  const [isLoading, setIsLoading] = useState(true);
  const [kpis, setKpis] = useState({
    totalItems: 0,
    actionRequired: 0,
    expired: 0,
    goodCondition: 0
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const { data: inventory, error } = await supabase
          .from('inventory_items')
          .select(`
            quantity,
            expiration_date,
            product:products (
               name,
               exclude_from_program, 
               brand:product_brands(name, participates_in_program),
               category:product_categories(name, discount_intervals)
            )
          `)
          .eq('is_removed', false);

        if (error) throw error;

        if (inventory) {
          let total = 0;
          let actionCount = 0;
          let expiredCount = 0;
          const expiryMap: Record<string, number> = {};
          const generatedAlerts: any[] = [];

          inventory.forEach((item: any) => {
            total += item.quantity;
            
            // Calculate status using the helper function
            const { status, daysLeft, action, priority } = calculateProductStatus(item as any);

            if (status === 'expired') {
              expiredCount += item.quantity;
              generatedAlerts.push({
                type: 'expired',
                priority,
                product: item.product?.name,
                detail: item.product?.brand?.name,
                days: Math.abs(daysLeft),
                quantity: item.quantity,
                action
              });
            } else if (status !== 'ok') {
              actionCount += item.quantity;
              generatedAlerts.push({
                type: status,
                priority,
                product: item.product?.name,
                detail: status === 'discount' ? item.product?.category?.name : "No participa",
                days: daysLeft,
                quantity: item.quantity,
                action,
                isProgram: status === 'discount'
              });
            }

            if (daysLeft >= 0 && daysLeft <= 7) {
               const expDate = new Date(item.expiration_date);
               const dateKey = expDate.toLocaleDateString('es-MX', { weekday: 'short' });
               expiryMap[dateKey] = (expiryMap[dateKey] || 0) + item.quantity;
            }
          });

          setKpis({
            totalItems: total,
            actionRequired: actionCount,
            expired: expiredCount,
            goodCondition: total - actionCount - expiredCount
          });

          generatedAlerts.sort((a, b) => {
             if (a.priority !== b.priority) return a.priority - b.priority;
             return a.days - b.days;
          });
          setAlerts(generatedAlerts.slice(0, 15)); 

          const daysOfWeek = [];
          for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(d.getDate() + i);
            const key = d.toLocaleDateString('es-MX', { weekday: 'short' });
            daysOfWeek.push({
                date: key.charAt(0).toUpperCase() + key.slice(1),
                value: expiryMap[key] || 0
            });
          }
          setChartData(daysOfWeek);
        }
      } catch (err) {
        console.error("Error dashboard:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { kpis, chartData, alerts, isLoading };
}