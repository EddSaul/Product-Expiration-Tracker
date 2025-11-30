import { useEffect, useState } from "react";
import { supabase } from "@/config/supabaseClient";
import { useStore } from "@/store/useStore";
import { UserPlus, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { UserList } from "./components/UserList";
import { UserDetails } from "./components/UserDetails";
import { UserModal } from "./components/UserModal";
import type { Profile, UserLog } from "@/features/auth/types"; 

export default function AdminUsersPage() {
  const { users, fetchUsers, roles, fetchRoles, logAction } = useStore();
  
  const [selectedUser, setSelectedUser] = useState<Profile | null>(null);
  const [logs, setLogs] = useState<UserLog[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true); 
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const initData = async () => {
      setIsLoadingUsers(true);
      await Promise.all([fetchUsers(), fetchRoles()]);
      setIsLoadingUsers(false); 
    };
    initData();
  }, []);

  useEffect(() => {
    if (!selectedUser) return;
    
    const fetchLogs = async () => {
      setIsLoadingLogs(true);
      const { data } = await supabase
        .from('user_logs')
        .select('*')
        .eq('user_id', selectedUser.id)
        .order('created_at', { ascending: false })
        .limit(50);
      
      setLogs((data as unknown as UserLog[]) || []);
      setIsLoadingLogs(false);
    };
    fetchLogs();
  }, [selectedUser]);

  const handleSaveUser = async (formData: any) => {
    try {
      if (isEditing && selectedUser) {
        const selectedRole = roles.find(r => r.role_name === formData.roleName);
        if (!selectedRole) throw new Error("Rol inválido");

        const { error } = await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName,
            employee_id: formData.employeeId,
            role_id: selectedRole.id
          })
          .eq('id', selectedUser.id);

        if (error) throw error;
        
        await logAction('UPDATE_USER', `Actualizó empleado: ${formData.employeeId}`);
        setIsUserModalOpen(false);
        fetchUsers();

      } else {
        const DOMAIN_SUFFIX = "@tienda-interna.local";
        const syntheticEmail = `${formData.employeeId.trim()}${DOMAIN_SUFFIX}`;

        const { error } = await supabase.auth.signUp({
          email: syntheticEmail,
          password: formData.password,
          options: {
            data: {
              full_name: formData.fullName,
              employee_id: formData.employeeId,
              role: formData.roleName,
            },
          },
        });

        if (error) throw error;
        
        await logAction('CREATE_USER', `Creó nuevo usuario: ${formData.employeeId}`);
        setIsUserModalOpen(false);
        fetchUsers(); 
      }
    } catch (error: any) {
      console.error(error);
      alert("Error: " + (error.message || "Ocurrió un error inesperado"));
    }
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);

    try {
      const { error } = await supabase.from('profiles').delete().eq('id', userToDelete.id);
      if (error) throw error;
      
      await logAction('DELETE_USER', `Eliminó al usuario: ${userToDelete.full_name} (${userToDelete.employee_id})`);
      setSelectedUser(null);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      alert("Error al eliminar: " + error.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 min-h-screen md:h-[calc(100vh-50px)] md:min-h-0">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-gray-900">Directorio de Personal</h2>
          <p className="text-muted-foreground text-sm">
             {users.length} empleados registrados. Gestiona accesos, roles y auditoría.
          </p>
        </div>
        <Button onClick={() => { setIsEditing(false); setIsUserModalOpen(true); }} className="bg-blue-600 hover:bg-blue-700 shadow-sm w-full sm:w-auto">
            <UserPlus className="mr-2 h-4 w-4" /> Nuevo Empleado
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 flex-1 h-auto md:h-full md:overflow-hidden">
        
        <div className="md:col-span-5 h-[400px] md:h-full">
            <UserList 
                users={users} 
                isLoading={isLoadingUsers} 
                selectedUser={selectedUser} 
                onSelectUser={(u) => {
                    setSelectedUser(u);
                    if (window.innerWidth < 768) {
                        setTimeout(() => document.getElementById('user-details-panel')?.scrollIntoView({ behavior: 'smooth' }), 100);
                    }
                }} 
            />
        </div>

        <div id="user-details-panel" className="md:col-span-7 h-[600px] md:h-full">
            <UserDetails 
                user={selectedUser} 
                logs={logs} 
                isLoadingLogs={isLoadingLogs} 
                onEdit={(u) => { setSelectedUser(u); setIsEditing(true); setIsUserModalOpen(true); }} 
                onDelete={(u) => setUserToDelete(u)} 
            />
        </div>
      </div>

      <UserModal 
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        isEditing={isEditing}
        userToEdit={selectedUser}
        roles={roles}
        onSave={handleSaveUser}
      />

      <Dialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                Eliminar Empleado
            </DialogTitle>
            <DialogDescription className="pt-2">
              Estás a punto de eliminar a <strong>{userToDelete?.full_name}</strong>.
            </DialogDescription>
          </DialogHeader>
          
          <div className="bg-red-50 p-4 rounded-md border border-red-100 text-sm text-red-800">
            <p className="font-medium mb-1">¿Estás seguro?</p>
            <ul className="list-disc pl-4 space-y-1">
                <li>El usuario perderá el acceso al sistema inmediatamente.</li>
                <li>El historial de bitácora podría quedar huérfano.</li>
                <li>Esta acción <strong>no se puede deshacer</strong>.</li>
            </ul>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setUserToDelete(null)} disabled={isDeleting}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDeleteUser} disabled={isDeleting}>
              {isDeleting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Eliminando...</> : "Confirmar Eliminación"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </div>
  );
}