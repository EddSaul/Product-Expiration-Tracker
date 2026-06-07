import { User, Shield, Pencil, Trash2, Activity, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import type { Profile, UserLog } from "@/features/auth/types";

interface UserDetailsProps {
  user: Profile | null;
  logs: UserLog[];
  isLoadingLogs: boolean;
  onEdit: (user: Profile) => void;
  onDelete: (user: Profile) => void;
}

export function UserDetails({ user, logs, isLoadingLogs, onEdit, onDelete }: UserDetailsProps) {
  
  if (!user) {
    return (
      <Card className="md:col-span-7 h-full flex flex-col border-border shadow-md bg-card overflow-hidden">
        <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
          <User className="h-16 w-16 mb-4 opacity-10" />
          <p>Selecciona un empleado para ver detalles</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="md:col-span-7 h-full flex flex-col border-border shadow-md bg-card overflow-hidden">
      <CardHeader className="border-b bg-muted/30 shrink-0">
        <div className="flex justify-between items-start">
          <div className="flex gap-4 items-center">
            <Avatar className="h-16 w-16 border-2 border-white shadow-sm">
                <AvatarFallback className="text-xl bg-blue-600 text-white">
                    {user.full_name?.substring(0,2).toUpperCase()}
                </AvatarFallback>
            </Avatar>
            <div>
                <CardTitle className="text-xl">{user.full_name}</CardTitle>
                <div className="flex flex-col gap-1 mt-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Shield className="h-3 w-3" /> 
                        <span className="uppercase font-semibold text-xs">{user.role?.role_name?.replace('_', ' ')}</span>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Último acceso: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Nunca'}
                    </div>
                </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => onEdit(user)}>
                <Pencil className="h-3 w-3 mr-2" /> Editar
            </Button>
            <Button variant="destructive" size="sm" onClick={() => onDelete(user)}>
                <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 min-h-0 flex flex-col p-0 overflow-hidden">
        <div className="p-4 pb-2 shrink-0 bg-card border-b border-border">
          <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-4 w-4 text-blue-600" /> Bitácora de Actividad
          </h3>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto p-4">
          {isLoadingLogs ? (
            <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground"/></div>
          ) : logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 italic">Sin actividad reciente.</p>
          ) : (
            <div className="space-y-6 border-l-2 border-border ml-2 pl-6 relative pb-4">
              {logs.map(log => (
                <div key={log.id} className="relative group">
                  <span className="absolute -left-[31px] top-1 h-4 w-4 rounded-full bg-card border-2 border-border group-hover:border-blue-500 transition-colors"></span>
                  <p className="text-sm font-medium text-foreground">{log.action}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{log.details ?? ''}</p>
                  <span className="text-[10px] text-muted-foreground block mt-1">
                    {new Date(log.created_at).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}