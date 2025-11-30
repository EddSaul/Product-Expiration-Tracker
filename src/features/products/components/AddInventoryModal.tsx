import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BarcodeScanner } from "@/components/ui/BarcodeScanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { InventoryForm } from "./InventoryForm";
import { useInventoryLogic } from "../hooks/useInventoryLogic"; 
import { ProductAddedModal } from "./ProductAddedModal";

export function AddInventoryModal({ onSaved }: { onSaved: () => void }) {
  const logic = useInventoryLogic(onSaved);

  return (
    <>
      {/* Form Modal */}
      <Dialog open={logic.isOpen} onOpenChange={logic.setIsOpen}>
        <DialogTrigger asChild>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" /> Registrar Entrada
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Registrar Producto</DialogTitle>
            <DialogDescription>Usa la cámara o escribe el código manualmente.</DialogDescription>
          </DialogHeader>

          {logic.showScanner && (
              <BarcodeScanner 
                  onResult={logic.handleScanResult} 
                  onClose={() => logic.setShowScanner(false)} 
              />
          )}

          <InventoryForm 
              form={logic.form}
              initialBrands={logic.initialBrands}
              initialCategories={logic.initialCategories}
              onSearchBrands={logic.searchBrands}
              onSearchCategories={logic.searchCategories}
              
              isLoading={logic.isLoading}
              isSearching={logic.isSearching}
              existingProduct={logic.existingProduct}
              onScanClick={() => logic.setShowScanner(true)}
              onBarcodeBlur={() => logic.searchProduct(logic.form.getValues("barcode"))}
              onSubmit={logic.onFormSubmit}
          />
        </DialogContent>
      </Dialog>
      {/* Product Added Confirmation Modal */}
      <ProductAddedModal 
        isOpen={!!logic.lastAddedItem}
        onClose={() => logic.setLastAddedItem(null)}
        onAddAnother={() => {
            logic.setLastAddedItem(null);
            setTimeout(() => logic.setIsOpen(true), 100); // Reopen form after a brief delay
        }}
        productDetails={logic.lastAddedItem}
      />
    </>
  );
}