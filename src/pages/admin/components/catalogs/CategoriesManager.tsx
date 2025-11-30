import { useState } from "react";
import { supabase } from "@/config/supabaseClient";
import { useStore } from "@/store/useStore";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, Trash2, RefreshCw, Pencil, X, Check, Lock } from "lucide-react";
import { forceDeleteCatalogItem } from "../../utils/catalogActions"; 

export function CategoriesManager() {
  const { categories, fetchCatalogs, userRole } = useStore();
  //  Creation States
  const [newName, setNewName] = useState("");
  const [newIntervals, setNewIntervals] = useState(""); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  // Editing States
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editIntervals, setEditIntervals] = useState("");
  const isAdmin = userRole?.toLowerCase() === 'administrador';
  const parseIntervals = (str: string) => {
    return str.split(',').map(num => parseInt(num.trim())).filter(num => !isNaN(num)).sort((a, b) => b - a);
  }

  // CREATE 
  const addCategory = async () => {
    if (!isAdmin || !newName) return;
    setIsSubmitting(true);

    const intervalsArray = parseIntervals(newIntervals);
    const { error } = await supabase.from('product_categories').insert({ name: newName, discount_intervals: intervalsArray });

    if (error) alert("Error: " + error.message);
    else {
        setNewName(""); setNewIntervals(""); await fetchCatalogs(true);
    }
    setIsSubmitting(false);
  };

  // DELETE
  const deleteCategory = async (id: number) => {
    if (!isAdmin) return;
    const { error } = await supabase.from('product_categories').delete().eq('id', id);
    
    if (error) {
        if (error.code === '23503') {
            const confirmForce = confirm("⚠️ ESTA CATEGORÍA TIENE PRODUCTOS.\n\n¿Borrar TODO el contenido?");
            if (confirmForce) {
                setDeletingId(id);
                const result = await forceDeleteCatalogItem(id, 'category');
                if (result.success) { alert("✅ Eliminado."); fetchCatalogs(true); }
                else alert("❌ Error: " + result.message);
                setDeletingId(null);
            }
        } else alert("Error: " + error.message);
    } else fetchCatalogs(true);
  };

  // EDIT
  const startEditing = (cat: any) => {
    setEditingId(cat.id);
    setEditName(cat.name);
    setEditIntervals(cat.discount_intervals?.join(", ") || "");
  };

  const saveEdit = async () => {
    if (!editingId) return;
    const intervalsArray = parseIntervals(editIntervals);
    const { error } = await supabase
        .from('product_categories')
        .update({ name: editName, discount_intervals: intervalsArray })
        .eq('id', editingId);

    if (error) alert("Error al actualizar: " + error.message);
    else { await fetchCatalogs(true); setEditingId(null); }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
            Reglas de Caducidad
            <div className="flex gap-2">
                {!isAdmin && <Badge variant="outline" className="text-orange-600 border-orange-200 bg-orange-50"><Lock className="w-3 h-3 mr-1"/> Solo Lectura</Badge>}
                <Button variant="ghost" size="sm" onClick={() => fetchCatalogs(true)}><RefreshCw className="w-4 h-4 text-gray-500"/></Button>
            </div>
        </CardTitle>
        <CardDescription>Define los días antes de caducar para aplicar rebajas.</CardDescription>
      </CardHeader>
      <CardContent>
        {!editingId && (
            <div className={`flex flex-col md:flex-row gap-3 mb-6 p-4 bg-slate-50 rounded-lg border ${!isAdmin ? 'opacity-60 pointer-events-none' : ''}`}>
                <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Nombre Categoría</label>
                    <Input placeholder="Ej: Lácteos" value={newName} onChange={e => setNewName(e.target.value)} disabled={!isAdmin} />
                </div>
                <div className="flex-1">
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Reglas (Días separados por comas)</label>
                    <Input placeholder="Ej: 30, 15, 5" value={newIntervals} onChange={e => setNewIntervals(e.target.value)} disabled={!isAdmin} />
                </div>
                <div className="flex items-end">
                    <Button onClick={addCategory} disabled={isSubmitting || !isAdmin} className="w-full md:w-auto">
                        {isSubmitting ? <Loader2 className="animate-spin w-4 h-4"/> : <Plus className="w-4 h-4 mr-2"/>} Crear
                    </Button>
                </div>
            </div>
        )}

        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[50px]">ID</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Intervalos</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {categories.map((cat: any) => (
                        <TableRow key={cat.id}>
                            <TableCell className="font-mono text-xs">{cat.id}</TableCell>
                            {editingId === cat.id ? (
                                <>
                                    <TableCell><Input value={editName} onChange={e => setEditName(e.target.value)} className="h-8" /></TableCell>
                                    <TableCell><Input value={editIntervals} onChange={e => setEditIntervals(e.target.value)} className="h-8" /></TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600" onClick={saveEdit}><Check className="w-4 h-4" /></Button>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600" onClick={() => setEditingId(null)}><X className="w-4 h-4" /></Button>
                                        </div>
                                    </TableCell>
                                </>
                            ) : (
                                <>
                                    <TableCell className="font-medium">{cat.name}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-1 flex-wrap">
                                            {cat.discount_intervals?.map((days: number) => <Badge key={days} variant="secondary" className="text-xs">{days}d</Badge>)}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" onClick={() => startEditing(cat)} disabled={!isAdmin} className="h-8 w-8 hover:text-blue-600"><Pencil className="w-4 h-4" /></Button>
                                            <Button variant="ghost" size="icon" onClick={() => deleteCategory(cat.id)} disabled={!isAdmin || deletingId === cat.id} className="h-8 w-8 hover:text-red-600">
                                                {deletingId === cat.id ? <Loader2 className="w-3 h-3 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                                            </Button>
                                        </div>
                                    </TableCell>
                                </>
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      </CardContent>
    </Card>
  );
}