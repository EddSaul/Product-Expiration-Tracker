import { Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName?: string;
  isWithdrawing: boolean;
}

export function WithdrawalModal({ isOpen, onClose, onConfirm, productName, isWithdrawing }: WithdrawalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Confirmar Retiro
          </DialogTitle>
          <DialogDescription className="pt-2">
            Estás a punto de retirar <strong>{productName}</strong> del piso de venta.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 text-sm text-muted-foreground bg-slate-50 p-4 rounded-md border">
          <p>• El producto se moverá al historial de retirados.</p>
          <p>• Se eliminará permanentemente en <strong>2 semanas</strong>.</p>
          <p>• Esta acción <strong>no</strong> afecta al catálogo maestro.</p>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isWithdrawing}>
            Cancelar
          </Button>
          <Button 
            variant="destructive" 
            onClick={onConfirm} 
            disabled={isWithdrawing}
          >
            {isWithdrawing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Retirando...
              </>
            ) : (
              "Confirmar Retiro"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}