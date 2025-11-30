import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { supabase } from "@/config/supabaseClient"; 
import { Package, Menu, Loader2, X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Sidebar } from "./Sidebar"; 

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [userData, setUserData] = useState({ name: "", role: "" });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          navigate('/login');
          return;
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role:roles(role_name)')
            .eq('id', user.id)
            .single();

        setUserData({
          name: profile?.full_name || user.user_metadata?.full_name || "Usuario",
          role: profile?.role?.role_name || user.user_metadata?.role || "Empleado",
        });
      } catch (error) {
        console.error("Error de sesión:", error);
        navigate('/login');
      } finally {
        setIsLoading(false);
      }
    };

    getUserData();
  }, [navigate]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-sm text-gray-500 font-medium">Cargando sistema...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      
      {/* Mobil sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${isSidebarOpen ? "block" : "hidden"}`}>
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
            onClick={() => setIsSidebarOpen(false)} 
        />
        <div className="fixed inset-y-0 left-0 w-64 animate-in slide-in-from-left duration-300 z-50">
            <Sidebar 
                userRole={userData.role} 
                userName={userData.name} 
                onLogout={handleLogout} 
            />
            <button 
                onClick={() => setIsSidebarOpen(false)} 
                className="absolute top-4 right-[-40px] text-white bg-slate-800 p-1 rounded-md lg:hidden"
            >
                <X className="h-6 w-6" />
            </button>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40">
        <Sidebar 
            userRole={userData.role} 
            userName={userData.name} 
            onLogout={handleLogout} 
        />
      </div>

      {/* Main area */}
      <div className="flex flex-1 flex-col lg:pl-64 overflow-hidden transition-all min-h-screen">
        
        {/* Mobile header */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-gray-200 bg-white px-4 shadow-sm lg:hidden z-30">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-900 font-bold text-lg">Product Expiration Tracker</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(true)}>
                <Menu className="h-6 w-6 text-gray-600" />
            </Button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 p-4 md:p-8 relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}