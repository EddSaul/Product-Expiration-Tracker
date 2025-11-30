import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar, AlertCircle, AlertTriangle, Tag, CheckCircle2, ArchiveX, Loader2, Pencil, Check, X } from "lucide-react";
import type { InventoryItem } from "@/features/products/types";
import { calculateProductStatus } from "@/features/products/utils/statusHelpers";

interface ProductsTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  onWithdrawClick: (item: InventoryItem) => void;
  onUpdateQuantity: (item: InventoryItem, qty: number) => Promise<boolean>;
  emptyMessage?: string;
}

export function ProductsTable({ items, isLoading, onWithdrawClick, onUpdateQuantity, emptyMessage = "No hay productos." }: ProductsTableProps) {
  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-10 w-10 animate-spin text-primary" /></div>;
  }

  if (items.length === 0) {
    return <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[120px]">Código</TableHead>
            <TableHead className="min-w-[200px]">Producto</TableHead>
            <TableHead className="hidden md:table-cell">Marca</TableHead>
            <TableHead className="hidden md:table-cell">Categoría</TableHead>
            <TableHead>Caducidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right w-[140px]">Piezas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <ProductRow 
                key={item.id} 
                item={item} 
                onWithdraw={() => onWithdrawClick(item)} 
                onUpdateQuantity={onUpdateQuantity} 
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Subcomponent for each product row
function ProductRow({ item, onWithdraw, onUpdateQuantity }: { item: InventoryItem; onWithdraw: () => void, onUpdateQuantity: (item: InventoryItem, qty: number) => Promise<boolean> }) {
  const { status, daysLeft } = calculateProductStatus(item);

  return (
    <TableRow className="group hover:bg-slate-50">
      <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-slate-900">
        {item.product?.barcode}
      </TableCell>
      <TableCell className="font-medium text-slate-900">{item.product?.name}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">{item.product?.brand?.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        <Badge variant="outline" className="font-normal">{item.product?.category?.name}</Badge>
      </TableCell>
      <TableCell className="text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-gray-400" />
          <span className={daysLeft < 0 ? "text-red-600 font-medium" : ""}>
            {new Date(item.expiration_date).toLocaleDateString()}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {daysLeft < 0 ? `Venció hace ${Math.abs(daysLeft)} días` : `${daysLeft} días restantes`}
        </span>
      </TableCell>
      <TableCell>
        <StatusBadge status={status} />
      </TableCell>
      
      {/* Editable quantity */}
      <TableCell className="text-right">
        <QuantityCell item={item} onUpdate={onUpdateQuantity} />
      </TableCell>

      <TableCell className="text-right">
        <Button variant="ghost" size="icon" onClick={onWithdraw} title="Retirar" className="text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors">
          <ArchiveX className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}

function QuantityCell({ item, onUpdate }: { item: InventoryItem, onUpdate: (item: InventoryItem, qty: number) => Promise<boolean> }) {
  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState(item.quantity.toString());
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    const num = parseInt(value);
    if (isNaN(num) || num < 1 || num === item.quantity) {
        setIsEditing(false);
        setValue(item.quantity.toString());
        return;
    }
    
    setIsSaving(true);
    const success = await onUpdate(item, num);
    setIsSaving(false);
    
    if (success) setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center justify-end gap-1">
         <Input 
            type="number" 
            className="h-7 w-16 px-1 text-center text-sm" 
            value={value} 
            onChange={e => setValue(e.target.value)}
            autoFocus
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
            }}
         />
         <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:bg-green-50" onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin"/> : <Check className="h-3 w-3"/>}
         </Button>
         <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:bg-red-50" onClick={() => { setIsEditing(false); setValue(item.quantity.toString()); }}>
            <X className="h-3 w-3"/>
         </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2 group/qty relative">
       <span className="font-bold text-slate-700">{item.quantity}</span>
       <Button 
         size="icon" 
         variant="ghost" 
         className="h-6 w-6 opacity-0 group-hover/qty:opacity-100 transition-opacity text-slate-400 hover:text-blue-600 absolute -right-8"
         onClick={() => { setValue(item.quantity.toString()); setIsEditing(true); }}
         title="Editar cantidad"
       >
         <Pencil className="h-3 w-3" />
       </Button>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'expired': return <Badge variant="destructive" className="flex w-fit items-center gap-1 px-2"><AlertCircle className="h-3 w-3"/> Vencido</Badge>;
    case 'risk': return <Badge className="bg-orange-500 hover:bg-orange-600 flex w-fit items-center gap-1 px-2"><AlertTriangle className="h-3 w-3"/> Crítico</Badge>;
    case 'discount': return <Badge className="bg-blue-600 hover:bg-blue-700 flex w-fit items-center gap-1 px-2"><Tag className="h-3 w-3"/> Rebaja</Badge>;
    default: return <Badge variant="secondary" className="text-green-700 bg-green-100 hover:bg-green-200 flex w-fit items-center gap-1 px-2"><CheckCircle2 className="h-3 w-3"/> OK</Badge>;
  }
}