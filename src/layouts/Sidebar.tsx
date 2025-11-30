import { NavLink } from 'react-router-dom';
import { 
  Package, 
  Users, 
  BarChart3, 
  LogOut, 
  LayoutDashboard, 
  Tags 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface SidebarProps {
  userRole: string;
  userName: string;
  onLogout: () => void;
}

export function Sidebar({ userRole, userName, onLogout }: SidebarProps) {
  
  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2) || "U";
  };

    // Base Navigation Configuration
  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Productos', href: '/dashboard/productos', icon: Package },
    { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  ];

  // Admin Navigation Configuration
  const adminNavigation = [
    { name: 'Gestión Usuarios', href: '/dashboard/admin/usuarios', icon: Users },
    { name: 'Catálogos Maestros', href: '/dashboard/admin/catalogos', icon: Tags },
  ];

  // Combine navigation based on user role
  const finalNavigation = userRole?.toLowerCase() === 'administrador' 
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation;

  return (
    <div className="flex flex-col h-full bg-slate-900 text-white shadow-xl border-r border-slate-800">
      {/* Header Sidebar */}
      <div className="flex-shrink-0 flex items-center p-6 border-b border-slate-800">
        <div className="h-10 w-10 bg-blue-600 rounded-lg mr-3 flex items-center justify-center shadow-lg shadow-blue-900/20">
            <Package className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-white"> Expiration Tracker</h1>
          <p className="text-slate-400 text-xs font-medium">v1.0</p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-grow space-y-1 p-4">
        {finalNavigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            end={item.href === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md transition-all duration-200 group mb-1
               ${isActive 
                 ? 'bg-blue-600 text-white shadow-md' 
                 : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`
            }
          >
            <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${location.pathname === item.href ? 'text-white' : 'text-slate-500 group-hover:text-white'}`} />
            <span className="font-medium text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center mb-4">
            <Avatar className="h-9 w-9 border border-slate-600">
                <AvatarFallback className="bg-slate-700 text-white text-xs font-bold">
                    {getInitials(userName)}
                </AvatarFallback>
            </Avatar>
            <div className="ml-3 flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{userName}</p>
                <p className="text-slate-400 text-xs truncate capitalize">{userRole.replace('_', ' ')}</p>
            </div>
        </div>
        
        <Button 
            onClick={onLogout} 
            variant="ghost" 
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-950/30 h-9 px-2"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-xs uppercase tracking-wider font-semibold">Log Out</span>
        </Button>
      </div>
    </div>
  );
}