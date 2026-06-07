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
import { ThemeToggle } from "@/components/theme-toggle";

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

  const baseNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Productos', href: '/dashboard/productos', icon: Package },
    { name: 'Reportes', href: '/dashboard/reportes', icon: BarChart3 },
  ];

  const adminNavigation = [
    { name: 'Gestión Usuarios', href: '/dashboard/admin/usuarios', icon: Users },
    { name: 'Catálogos Maestros', href: '/dashboard/admin/catalogos', icon: Tags },
  ];

  const isAdmin = userRole?.toLowerCase() === 'administrador';

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group mb-1
     ${isActive
       ? 'bg-sidebar-primary/15 text-sidebar-primary font-semibold ring-1 ring-sidebar-primary/20'
       : 'text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground'}`;

  return (
    <div className="flex flex-col h-full bg-sidebar text-sidebar-foreground shadow-xl border-r border-sidebar-border">
      {/* Header Sidebar */}
      <div className="flex-shrink-0 flex items-center p-6 border-b border-sidebar-border">
        <div className="h-10 w-10 bg-primary rounded-xl mr-3 flex items-center justify-center shadow-lg shadow-primary/30">
            <Package className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-bold tracking-tight text-sidebar-foreground">Expiration Tracker</h1>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex-grow p-4 overflow-y-auto" aria-label="Navegación principal">
        <div className="space-y-1">
          {baseNavigation.map((item) => (
            <NavLink key={item.name} to={item.href} end={item.href === '/dashboard'} className={linkClass}>
              {({ isActive }) => (
                <>
                  <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground'}`} />
                  <span className="text-sm">{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {isAdmin && (
          <>
            <div className="my-4 border-t border-sidebar-border/60" />
            <p className="px-3 mb-2 text-[10px] uppercase tracking-widest font-semibold text-sidebar-foreground/40">
              Administración
            </p>
            <div className="space-y-1">
              {adminNavigation.map((item) => (
                <NavLink key={item.name} to={item.href} className={linkClass}>
                  {({ isActive }) => (
                    <>
                      <item.icon className={`mr-3 h-5 w-5 flex-shrink-0 transition-colors ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground/40 group-hover:text-sidebar-foreground'}`} />
                      <span className="text-sm">{item.name}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </>
        )}
      </nav>

      {/* User Footer */}
      <div className="p-4 border-t border-sidebar-border bg-sidebar-accent/30">
        <div className="flex items-center justify-between mb-4 gap-2">
            <div className="flex items-center min-w-0">
                <Avatar className="h-9 w-9 border border-sidebar-border">
                    <AvatarFallback className="bg-sidebar-accent text-sidebar-foreground text-xs font-bold">
                        {getInitials(userName)}
                    </AvatarFallback>
                </Avatar>
                <div className="ml-3 flex-1 min-w-0">
                    <p className="text-sidebar-foreground text-sm font-medium truncate">{userName}</p>
                    <p className="text-sidebar-foreground/50 text-xs truncate capitalize">{userRole.replace('_', ' ')}</p>
                </div>
            </div>
            <ThemeToggle className="shrink-0 border-sidebar-border bg-sidebar-accent/50 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground" />
        </div>

        <Button
            onClick={onLogout}
            variant="ghost"
            aria-label="Cerrar sesión"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 h-9 px-2"
        >
          <LogOut className="w-4 h-4 mr-2" />
          <span className="text-xs uppercase tracking-wider font-semibold">Cerrar sesión</span>
        </Button>
      </div>
    </div>
  );
}
