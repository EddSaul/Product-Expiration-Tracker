import { useProductsPage, type SortOption } from "@/features/products/hooks/useProductsPage";
import { AddInventoryModal } from "@/features/products/components/AddInventoryModal"; 
import { WithdrawalModal } from "@/features/products/components/WithdrawalModal";
import { ProductsTable } from "@/features/products/components/ProductsTable"; 
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ProductsPage() {
  const { 
    items, isLoading, searchTerm, setSearchTerm, 
    sortOption, setSortOption, 
    itemToWithdraw, setItemToWithdraw, isWithdrawing, 
    fetchInventory, confirmWithdraw, updateQuantity 
  } = useProductsPage();

  return (
    <div className="space-y-6 p-2 md:p-0">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventario Activo</h2>
          <p className="text-muted-foreground">Gestiona entradas y monitorea caducidades.</p>
        </div>
        <AddInventoryModal onSaved={fetchInventory} />
      </div>

      {/* Barra de Herramientas: Búsqueda + Ordenamiento */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm">
            <Search className="w-4 h-4 text-gray-400 ml-2" />
            <Input 
                placeholder="Buscar por nombre, código o marca..." 
                className="border-0 focus-visible:ring-0"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>

        {/*Selector de Ordenamiento */}
        <div className="w-full md:w-[200px]">
            <Select value={sortOption} onValueChange={(val: SortOption) => setSortOption(val)}>
                <SelectTrigger className="h-[42px] bg-white border shadow-sm">
                    <div className="flex items-center text-muted-foreground">
                        <ArrowUpDown className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Ordenar por" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="date">Fecha Caducidad</SelectItem>
                    <SelectItem value="status">Prioridad / Estado</SelectItem>
                    <SelectItem value="category">Categoría</SelectItem>
                </SelectContent>
            </Select>
        </div>
      </div>

      <Card className="border-slate-200 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gray-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
                Productos en Piso <Badge variant="outline" className="ml-2">{items.length}</Badge>
            </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
            <ProductsTable 
                items={items} 
                isLoading={isLoading} 
                onWithdrawClick={setItemToWithdraw}
                onUpdateQuantity={updateQuantity}
                emptyMessage={searchTerm ? "No se encontraron productos." : "No hay productos activos."}
            />
        </CardContent>
      </Card>

      <WithdrawalModal 
        isOpen={!!itemToWithdraw}
        onClose={() => setItemToWithdraw(null)}
        onConfirm={confirmWithdraw}
        productName={itemToWithdraw?.product?.name}
        isWithdrawing={isWithdrawing}
      />
    </div>
  );
}