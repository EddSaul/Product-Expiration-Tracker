import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save } from "lucide-react";
import type { Profile } from "@/features/auth/types";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  isEditing: boolean;
  userToEdit: Profile | null;
  roles: any[];
  onSave: (data: any) => Promise<void>;
}

export function UserModal({ isOpen, onClose, isEditing, userToEdit, roles, onSave }: UserModalProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    employeeId: "",
    password: "",
    roleName: "",
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (isEditing && userToEdit) {
        setFormData({
          fullName: userToEdit.full_name,
          employeeId: userToEdit.employee_id,
          password: "", 
          roleName: userToEdit.role?.role_name || "",
        });
      } else {
        setFormData({ fullName: "", employeeId: "", password: "", roleName: "" });
      }
    }
  }, [isOpen, isEditing, userToEdit]);

  const handleSave = async () => {
    if (!formData.fullName || !formData.employeeId || !formData.roleName) {
      alert("Por favor completa todos los campos obligatorios.");
      return;
    }
    if (!isEditing && !formData.password) {
      alert("La contraseña es obligatoria para nuevos usuarios.");
      return;
    }

    setIsSaving(true);
    await onSave(formData);
    setIsSaving(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Editar Empleado" : "Nuevo Empleado"}</DialogTitle>
          <DialogDescription>
            {isEditing ? "Modifica los datos del usuario. El ID no se puede cambiar." : "Ingresa los datos para dar de alta un nuevo usuario."}
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input 
              id="name" 
              value={formData.fullName} 
              onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="employeeId">ID Empleado / Nómina</Label>
            <Input 
              id="employeeId" 
              value={formData.employeeId} 
              onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
              disabled={isEditing} 
              className={isEditing ? "bg-slate-100 text-slate-500" : ""}
            />
          </div>

          {!isEditing && (
              <div className="grid gap-2">
              <Label htmlFor="password">Contraseña Inicial</Label>
              <Input 
                  id="password" 
                  type="password"
                  placeholder="******"
                  value={formData.password} 
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              </div>
          )}

          <div className="grid gap-2">
            <Label>Puesto / Rol</Label>
            <Select 
              value={formData.roleName} 
              onValueChange={(val) => setFormData({...formData, roleName: val})}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role: any) => (
                  <SelectItem key={role.id} value={role.role_name}>
                      {role.role_name.replace('_', ' ').toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancelar</Button>
          <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              {isEditing ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}