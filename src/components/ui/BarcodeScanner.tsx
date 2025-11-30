import { useEffect, useRef, useState } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";
import type { IScannerControls } from "@zxing/browser";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { Loader2, X, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BarcodeScannerProps {
  onResult: (decodedText: string) => void;
  onClose: () => void;
}

export function BarcodeScanner({ onResult, onClose }: BarcodeScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  
  const codeReader = useRef<BrowserMultiFormatReader | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    const hints = new Map();
    const formats = [
      BarcodeFormat.EAN_13,
      BarcodeFormat.EAN_8,
      BarcodeFormat.CODE_128,
      BarcodeFormat.CODE_39,
      BarcodeFormat.UPC_A,
      BarcodeFormat.UPC_E,
    ];
    hints.set(DecodeHintType.POSSIBLE_FORMATS, formats);
    hints.set(DecodeHintType.TRY_HARDER, false); 

    const startDecoding = async () => {
      try {
        codeReader.current = new BrowserMultiFormatReader(hints);
        
        const controls = await codeReader.current.decodeFromConstraints(
          {
            video: { 
                facingMode: { ideal: "environment" } 
            }
          },
          videoRef.current!,
          (result) => {
            if (result) {
              const text = result.getText();
              if (text && controlsRef.current) {
                handleStop();
                onResult(text);
              }
            }
          }
        );
        
        controlsRef.current = controls;
        setIsScanning(false); 
        
      } catch (err: any) {
        console.error("Error al iniciar cámara:", err);
        
        let msg = "No se pudo acceder a la cámara.";
        if (err.name === "NotAllowedError") {
            msg = "Permiso denegado. Habilita la cámara en tu navegador.";
        } else if (err.name === "NotFoundError") {
            msg = "No se encontraron cámaras en este dispositivo.";
        } else if (err.name === "NotReadableError") {
            msg = "La cámara está en uso por otra aplicación.";
        } else if (err.message) {
            msg = `${err.message}`;
        }
        
        setError(msg);
        setIsScanning(false);
      }
    };

    const timer = setTimeout(() => startDecoding(), 200);

    return () => {
      clearTimeout(timer);
      handleStop();
    };
  }, []);

  const handleStop = () => {
    if (controlsRef.current) {
      try {
          controlsRef.current.stop(); 
      } catch (e) {
          console.warn("Error al detener controles:", e);
      }
      controlsRef.current = null;
    }
    codeReader.current = null;
  };

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card shadow-sm">
        <div>
          <h3 className="text-card-foreground">Escáner de Código de Barras</h3>
          <p className="text-xs text-muted-foreground">Apunta la cámara al código</p>
        </div>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => {
            handleStop();
            onClose();
          }}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>

      {/* Video Area */}
      <div className="flex-1 relative bg-black">
        <video 
          ref={videoRef}
          className="w-full h-full object-cover"
        />

        {/* Loading State */}
        {isScanning && !error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background">
            <Loader2 className="h-10 w-10 animate-spin text-primary mb-3" />
            <p className="text-muted-foreground">Iniciando cámara...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background p-6">
            <div className="max-w-md w-full space-y-4 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-2" />
              <div>
                <h4 className="text-foreground mb-2">Error al acceder a la cámara</h4>
                <p className="text-sm text-muted-foreground mb-4">{error}</p>
              </div>
              <div className="text-xs text-muted-foreground bg-muted p-3 rounded-md text-left">
                <p className="mb-1">Nota:</p>
                <p>• Asegúrate de usar HTTPS o localhost</p>
                <p>• Verifica los permisos de cámara en tu navegador</p>
                <p>• Cierra otras aplicaciones que usen la cámara</p>
              </div>
              <Button variant="default" onClick={onClose} className="mt-4">
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Footer Simple */}
      <div className="px-4 py-2 border-t border-border bg-card text-center">
        <p className="text-xs text-muted-foreground">
          Soporta: EAN-13, EAN-8, Code-128, Code-39, UPC-A, UPC-E
        </p>
      </div>
    </div>
  );
}
