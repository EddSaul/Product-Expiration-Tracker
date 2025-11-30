import type { UseFormReturn } from "react-hook-form";
import { Loader2, ScanBarcode, Camera, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { SearchableSelect, type Option } from "@/components/ui/SearchableSelect"; 
import type { InventoryFormValues } from "./inventorySchema"; 

interface InventoryFormProps {
  form: UseFormReturn<InventoryFormValues>;
  initialBrands: Option[];
  initialCategories: Option[];
  onSearchBrands: (query: string) => Promise<Option[]>; 
  onSearchCategories: (query: string) => Promise<Option[]>; 
  isLoading: boolean;
  isSearching: boolean;
  existingProduct: { name: string } | null;
  onScanClick: () => void;
  onBarcodeBlur: () => void;
  onSubmit: (values: InventoryFormValues) => void;
}

const SimpleInput = ({ control, name, label, type="text", placeholder, disabled, className }: any) => (
  <FormField control={control} name={name} render={({ field }) => (
    <FormItem className={className}>
      <FormLabel>{label}</FormLabel>
      <FormControl><Input type={type} placeholder={placeholder} {...field} disabled={disabled} /></FormControl>
      <FormMessage />
    </FormItem>
  )} />
);

export function InventoryForm({ 
    form, 
    initialBrands, 
    initialCategories, 
    onSearchBrands, 
    onSearchCategories, 
    isLoading, 
    isSearching, 
    existingProduct, 
    onScanClick, 
    onBarcodeBlur, 
    onSubmit 
}: InventoryFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 py-4">
        
        {/* Barcode */}
        <div className="flex gap-3 items-end">
          <FormField control={form.control} name="barcode" render={({ field }) => (
            <FormItem className="flex-1">
              <FormLabel>Código de Barras</FormLabel>
              <div className="relative">
                <ScanBarcode className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input className="pl-8" placeholder="Escanea..." {...field} onBlur={() => { field.onBlur(); onBarcodeBlur(); }} />
              </div>
              <FormMessage />
            </FormItem>
          )} />
          <Button type="button" variant="outline" className="mb-2" onClick={onScanClick}><Camera className="h-4 w-4" /></Button>
          {isSearching && <Loader2 className="h-6 w-6 animate-spin text-blue-500 mb-2" />}
        </div>

        {existingProduct && (
           <div className="bg-green-50 text-green-700 p-2 rounded text-sm border border-green-200 -mt-2 font-medium">
              Encontrado: {existingProduct.name}
           </div>
        )}

        {/* Product Name*/}
        <SimpleInput control={form.control} name="name" label="Producto" placeholder="Ej: Leche" disabled={!!existingProduct} />

        {/* Brand & Category */}
        <div className="grid grid-cols-2 gap-4">
          
          <FormField
            control={form.control}
            name="brand_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Marca</FormLabel>
                <SearchableSelect 
                    value={field.value} 
                    onSelect={field.onChange} 
                    onSearch={onSearchBrands} 
                    initialOptions={initialBrands}
                    placeholder="Buscar marca..."
                    disabled={!!existingProduct}
                />
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Categoría</FormLabel>
                <SearchableSelect 
                    value={field.value} 
                    onSelect={field.onChange} 
                    onSearch={onSearchCategories} 
                    initialOptions={initialCategories}
                    placeholder="Buscar categoría..."
                    disabled={!!existingProduct}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="border-t my-2" />
        
        {/* Expiration & Quantity */}
        <div className="grid grid-cols-2 gap-4">
          <SimpleInput control={form.control} name="expiration_date" label="Caducidad" type="date" />
          <SimpleInput control={form.control} name="quantity" label="Cantidad" type="number" />
        </div>
        
        <Button type="submit" className="w-full mt-2" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />} 
          Guardar Entrada
        </Button>
      </form>
    </Form>
  );
}