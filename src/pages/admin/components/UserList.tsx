import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { Profile } from "@/features/auth/types";

interface UserListProps {
  users: Profile[];
  isLoading: boolean;
  selectedUser: Profile | null;
  onSelectUser: (user: Profile) => void;
}

export function UserList({ users, isLoading, selectedUser, onSelectUser }: UserListProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.employee_id?.includes(searchTerm)
  );

  return (
    <Card className="md:col-span-5 flex flex-col h-full border-slate-200 shadow-md overflow-hidden">
      <CardHeader className="pb-3 border-b shrink-0">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar por nombre o ID..." 
            className="pl-8" 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto bg-white">
        {isLoading ? (
           <div className="p-8 flex flex-col items-center justify-center text-muted-foreground">
              <Loader2 className="animate-spin mb-2 h-8 w-8 text-blue-500" />
              <span className="text-xs">Cargando...</span>
           </div>
        ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">No se encontraron usuarios.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredUsers.map(user => (
              <div 
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`p-4 cursor-pointer hover:bg-slate-50 transition-colors flex items-center gap-4 group
                  ${selectedUser?.id === user.id ? 'bg-blue-50 border-l-4 border-blue-600' : ''}
                `}
              >
                <Avatar className="h-10 w-10 border bg-slate-100">
                    <AvatarFallback className="text-slate-600 font-semibold">
                        {user.full_name?.substring(0,2).toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{user.full_name}</p>
                  <p className="text-xs text-gray-500">ID: {user.employee_id}</p>
                </div>
                <Badge variant="outline" className="capitalize px-2 py-0.5 text-[10px]">
                  {user.role?.role_name?.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}