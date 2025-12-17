import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/config/supabaseClient";
import { useStore } from "@/store/useStore";
import type { InventoryItem } from "@/features/products/types";
import { toast } from "sonner";
import { calculateProductStatus } from "../utils/statusHelpers"; 

export type SortOption = 'date' | 'category' | 'status';

export function useProductsPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<SortOption>('date');
  
  const [itemToWithdraw, setItemToWithdraw] = useState<InventoryItem | null>(null);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const { logAction } = useStore();

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('inventory_items')
        .select(`
          *,
          product:products (
            name,
            barcode,
            exclude_from_program,
            brand:product_brands (name, participates_in_program),
            category:product_categories (name, discount_intervals)
          )
        `)
        .eq('is_removed', false) 
        .order('expiration_date', { ascending: true }); 

      if (error) throw error;
      setItems((data as unknown) as InventoryItem[] || []);
    } catch (error) {
      console.error("Error cargando inventario:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchInventory(); }, []);

  const updateQuantity = async (item: InventoryItem, newQuantity: number) => {
    if (newQuantity < 1) {
        toast.error("La cantidad mínima es 1");
        return false;
    }
    
    try {
        const { error } = await supabase
            .from('inventory_items')
            .update({ quantity: newQuantity })
            .eq('id', item.id);

        if (error) throw error;

        logAction('UPDATE_STOCK', `Ajustó ${item.product?.name}: ${item.quantity} -> ${newQuantity} pzas`);
        toast.success("Inventario actualizado");
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, quantity: newQuantity } : i));
        return true;
    } catch (err: any) {
        console.error(err);
        toast.error("Error al actualizar", { description: err.message });
        return false;
    }
  };

  const confirmWithdraw = async () => {
    if (!itemToWithdraw) return;
    setIsWithdrawing(true);
    try {
        const { error } = await supabase
            .from('inventory_items')
            .update({ is_removed: true, removed_at: new Date().toISOString() })
            .eq('id', itemToWithdraw.id);

        if (error) throw error;

        logAction('REMOVE_STOCK', `Retiró ${itemToWithdraw.quantity} pzas de: ${itemToWithdraw.product?.name}`);
        await fetchInventory();
        setItemToWithdraw(null); 
    } catch (error: any) {
        console.error("Error al retirar:", error);
    } finally {
        setIsWithdrawing(false);
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = items.filter(item => 
        item.product?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.product?.barcode.includes(searchTerm)
    );

    return result.sort((a, b) => {
      if (sortOption === 'date') {
        return new Date(a.expiration_date).getTime() - new Date(b.expiration_date).getTime();
      }
      
      if (sortOption === 'category') {
        const catA = a.product?.category?.name || "ZZZ";
        const catB = b.product?.category?.name || "ZZZ";
        return catA.localeCompare(catB);
      }
      
      if (sortOption === 'status') {
        const weight = (item: any) => {
           const { status } = calculateProductStatus(item);
           switch(status) {
             case 'expired': return 1;
             case 'risk': return 2;
             case 'discount': return 3; 
             default: return 4;
           }
        };
        return weight(a) - weight(b);
      }
      return 0;
    });
  }, [items, searchTerm, sortOption]);

  return {
    items: filteredAndSortedItems, 
    isLoading,
    searchTerm,
    setSearchTerm,
    sortOption,     
    setSortOption,  
    itemToWithdraw,
    setItemToWithdraw,
    isWithdrawing,
    fetchInventory,
    confirmWithdraw,
    updateQuantity
  };
}