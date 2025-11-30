import { CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ProductAddedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAnother: () => void;
  productDetails: {
    name: string;
    quantity: number;
    expiration: string;
  } | null;
}

export function ProductAddedModal({ isOpen, onClose, onAddAnother, productDetails }: ProductAddedModalProps) {
  if (!productDetails) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Entrada Registrada
          </DialogTitle>
          <DialogDescription className="pt-2">
            El producto se ha añadido correctamente al inventario activo.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm text-muted-foreground bg-slate-50 p-4 rounded-md border space-y-1">
          <p className="font-medium text-slate-900 text-base">{productDetails.name}</p>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
                <span className="block text-xs text-slate-400 uppercase">Cantidad</span>
                <span className="font-medium">{productDetails.quantity} piezas</span>
            </div>
            <div>
                <span className="block text-xs text-slate-400 uppercase">Caducidad</span>
                <span className="font-medium">{productDetails.expiration}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Cerrar
          </Button>
          <Button onClick={onAddAnother} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" /> Añadir Otro
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}