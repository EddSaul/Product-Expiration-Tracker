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
import { Calendar, AlertCircle, AlertTriangle, Tag, CheckCircle2, ArchiveX, Loader2, Pencil, Check, X, PackageSearch } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { InventoryItem } from "@/features/products/types";
import { calculateProductStatus } from "@/features/products/utils/statusHelpers";

interface ProductsTableProps {
  items: InventoryItem[];
  isLoading: boolean;
  onWithdrawClick: (item: InventoryItem) => void;
  onUpdateQuantity: (item: InventoryItem, qty: number) => Promise<boolean>;
  emptyMessage?: string;
}

function ProductsTableSkeleton() {
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
          {Array.from({ length: 5 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
              <TableCell><div className="h-4 w-36 bg-muted animate-pulse rounded" /></TableCell>
              <TableCell className="hidden md:table-cell"><div className="h-4 w-20 bg-muted animate-pulse rounded" /></TableCell>
              <TableCell className="hidden md:table-cell"><div className="h-5 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
              <TableCell><div className="h-4 w-24 bg-muted animate-pulse rounded" /></TableCell>
              <TableCell><div className="h-5 w-16 bg-muted animate-pulse rounded-full" /></TableCell>
              <TableCell className="text-right"><div className="h-4 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
              <TableCell className="text-right"><div className="h-8 w-8 bg-muted animate-pulse rounded ml-auto" /></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

export function ProductsTable({ items, isLoading, onWithdrawClick, onUpdateQuantity, emptyMessage = "No hay productos." }: ProductsTableProps) {
  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={emptyMessage}
        description="Cuando registres productos en el inventario, aparecerán aquí."
      />
    );
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

const statusBorderColor: Record<string, string> = {
  expired: 'border-l-4 border-l-red-500',
  risk: 'border-l-4 border-l-orange-400',
  discount: 'border-l-4 border-l-blue-500',
  ok: 'border-l-4 border-l-transparent',
};

function ProductRow({ item, onWithdraw, onUpdateQuantity }: { item: InventoryItem; onWithdraw: () => void, onUpdateQuantity: (item: InventoryItem, qty: number) => Promise<boolean> }) {
  const { status, daysLeft } = calculateProductStatus(item);

  return (
    <TableRow className={`group hover:bg-muted/40 ${statusBorderColor[status] || statusBorderColor.ok}`}>
      <TableCell className="font-mono text-xs text-muted-foreground group-hover:text-foreground">
        {item.product?.barcode}
      </TableCell>
      <TableCell className="font-medium text-foreground">{item.product?.name}</TableCell>
      <TableCell className="hidden md:table-cell text-muted-foreground">{item.product?.brand?.name}</TableCell>
      <TableCell className="hidden md:table-cell">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25">{item.product?.category?.name}</span>
      </TableCell>
      <TableCell className="text-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-3 w-3 text-muted-foreground" />
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
        <Button variant="ghost" size="icon" onClick={onWithdraw} aria-label={`Retirar ${item.product?.name}`} className="text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors">
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
            aria-label="Editar cantidad"
            onKeyDown={(e) => {
                if (e.key === "Enter") handleSave();
                if (e.key === "Escape") setIsEditing(false);
            }}
         />
         <Button size="icon" variant="ghost" className="h-7 w-7 text-green-600 hover:bg-green-50" onClick={handleSave} disabled={isSaving} aria-label="Guardar cantidad">
            {isSaving ? <Loader2 className="h-3 w-3 animate-spin" role="status" aria-label="Guardando" /> : <Check className="h-3 w-3"/>}
         </Button>
         <Button size="icon" variant="ghost" className="h-7 w-7 text-red-400 hover:bg-red-50" onClick={() => { setIsEditing(false); setValue(item.quantity.toString()); }} aria-label="Cancelar edición">
            <X className="h-3 w-3"/>
         </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-end gap-2 group/qty relative">
       <span className="font-bold text-foreground/90">{item.quantity}</span>
       <Button
         size="icon"
         variant="ghost"
         className="h-6 w-6 opacity-0 group-hover/qty:opacity-100 transition-opacity text-muted-foreground hover:text-blue-600 absolute -right-8"
         onClick={() => { setValue(item.quantity.toString()); setIsEditing(true); }}
         aria-label={`Editar cantidad de ${item.product?.name}`}
       >
         <Pencil className="h-3 w-3" />
       </Button>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const base = "flex w-fit items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border";
  switch (status) {
    case 'expired': return <span className={`${base} bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-300 dark:border-red-500/25`}><AlertCircle className="h-3 w-3"/> Vencido</span>;
    case 'risk': return <span className={`${base} bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-500/10 dark:text-orange-300 dark:border-orange-500/25`}><AlertTriangle className="h-3 w-3"/> Crítico</span>;
    case 'discount': return <span className={`${base} bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-300 dark:border-blue-500/25`}><Tag className="h-3 w-3"/> Rebaja</span>;
    default: return <span className={`${base} bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-300 dark:border-green-500/25`}><CheckCircle2 className="h-3 w-3"/> OK</span>;
  }
}
