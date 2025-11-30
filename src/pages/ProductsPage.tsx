import { useProductsPage } from "@/features/products/hooks/useProductsPage";
import { AddInventoryModal } from "@/features/products/components/AddInventoryModal"; 
import { WithdrawalModal } from "@/features/products/components/WithdrawalModal";
import { ProductsTable } from "@/features/products/components/ProductsTable"; 
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ProductsPage() {
  const { 
    items, isLoading, searchTerm, setSearchTerm, 
    itemToWithdraw, setItemToWithdraw, isWithdrawing, 
    fetchInventory, confirmWithdraw, updateQuantity 
  } = useProductsPage();

  return (
    <div className="space-y-6 p-2 md:p-0">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Inventario Activo</h2>
          <p className="text-muted-foreground">Gestiona entradas y monitorea caducidades.</p>
        </div>
        <AddInventoryModal onSaved={fetchInventory} />
      </div>

      <div className="flex items-center gap-2 bg-white p-2 rounded-lg border shadow-sm max-w-md w-full">
        <Search className="w-4 h-4 text-gray-400 ml-2" />
        <Input 
            placeholder="Buscar..." 
            className="border-0 focus-visible:ring-0"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card className="border-slate-200 shadow-md overflow-hidden">
        <CardHeader className="pb-2 bg-gray-50/50 border-b">
            <CardTitle className="text-lg flex items-center gap-2">
                📦 Productos en Piso <Badge variant="outline" className="ml-2">{items.length}</Badge>
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