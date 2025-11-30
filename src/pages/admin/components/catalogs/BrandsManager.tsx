import { useState } from "react";
import { supabase } from "@/config/supabaseClient";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, RefreshCw, Lock } from "lucide-react";
import { forceDeleteCatalogItem } from "../../utils/catalogActions"; 

export function BrandsManager() {
  const { brands, fetchCatalogs, userRole } = useStore();
  const [newName, setNewName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const isAdmin = userRole?.toLowerCase() === 'administrador';

  const addBrand = async () => {
    if (!isAdmin || !newName) return;
    setIsSubmitting(true);
    const { error } = await supabase.from('product_brands').insert({ name: newName, participates_in_program: false });
    
    if (error) alert("Error: " + error.message);
    else { setNewName(""); await fetchCatalogs(true); }
    setIsSubmitting(false);
  };

  const deleteBrand = async (id: number) => {
    if (!isAdmin) return;
    const { error } = await supabase.from('product_brands').delete().eq('id', id);
    if (error) {
        if (error.code === '23503') { 
            const confirmForce = confirm("⚠️ ESTA MARCA TIENE PRODUCTOS.\n\n¿Borrar TODO lo asociado a esta marca?");
            if (confirmForce) {
                setDeletingId(id);
                const result = await forceDeleteCatalogItem(id, 'brand');
                if (result.success) { alert("✅ Eliminado."); fetchCatalogs(true); }
                else alert("❌ Error: " + result.message);
                setDeletingId(null);
            }
        } else alert("Error: " + error.message);
    } else fetchCatalogs(true);
  };

  const toggleProgram = async (id: number, currentVal: boolean) => {
    if (!isAdmin) return;
    await supabase.from('product_brands').update({ participates_in_program: !currentVal }).eq('id', id);
    fetchCatalogs(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            Marcas del Sistema
            <div className="flex gap-2">
                {!isAdmin && <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50"><Lock className="w-3 h-3 mr-1"/> Solo Lectura</Badge>}
                <Button variant="ghost" size="sm" onClick={() => fetchCatalogs(true)}><RefreshCw className="w-4 h-4 text-gray-500"/></Button>
            </div>
        </CardTitle>
        <CardDescription>Gestiona qué marcas participan en el programa.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className={`flex gap-2 mb-6 p-4 bg-slate-50 rounded-lg border items-end ${!isAdmin ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex-1">
                <label className="text-xs font-medium text-gray-500 mb-1 block">Nueva Marca</label>
                <Input placeholder="Ej: Valley Foods" value={newName} onChange={e => setNewName(e.target.value)} disabled={!isAdmin} />
            </div>
            <Button onClick={addBrand} disabled={isSubmitting || !isAdmin}>
                {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus className="w-4 h-4 mr-2"/>} Agregar
            </Button>
        </div>

        <div className="rounded-md border h-[500px] overflow-y-auto">
            <Table>
                <TableHeader className="sticky top-0 bg-white z-10">
                    <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Rebajas</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {brands.map((b: any) => (
                        <TableRow key={b.id}>
                            <TableCell className="font-mono text-xs">{b.id}</TableCell>
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell>
                                <Button 
                                    variant={b.participates_in_program ? "default" : "outline"} size="sm"
                                    onClick={() => toggleProgram(b.id, b.participates_in_program)}
                                    disabled={!isAdmin}
                                    className={`h-7 text-xs ${b.participates_in_program ? "bg-green-600 hover:bg-green-700" : "text-gray-500"}`}
                                >
                                    {b.participates_in_program ? "Sí, Participa" : "No Participa"}
                                </Button>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" onClick={() => deleteBrand(b.id)} disabled={!isAdmin || deletingId === b.id} className="h-8 w-8 hover:text-red-600">
                                    {deletingId === b.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className={`w-4 h-4 ${!isAdmin ? 'opacity-50' : ''}`} />}
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}