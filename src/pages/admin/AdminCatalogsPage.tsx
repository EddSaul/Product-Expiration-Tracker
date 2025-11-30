import { useState, useEffect } from "react";
import { supabase } from "@/config/supabaseClient";
import { useStore } from "@/store/useStore"; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { CategoriesManager } from "./components/catalogs/CategoriesManager";
import { BrandsManager } from "./components/catalogs/BrandsManager";

export default function AdminCatalogsPage() {
  const { fetchCatalogs, userRole, setUserRole } = useStore();
  const [isCheckingRole, setIsCheckingRole] = useState(false);
  
  useEffect(() => { 
    fetchCatalogs(); 

    const verifyAdminAccess = async () => {
      if (!userRole) {
        setIsCheckingRole(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('role:roles(role_name)')
            .eq('id', user.id)
            .single();
          
          if (profile?.role?.role_name) {
             setUserRole(profile.role.role_name);
          }
        }
        setIsCheckingRole(false);
      }
    };

    verifyAdminAccess();
  }, []);

  if (isCheckingRole && !userRole) {
    return (
        <div className="flex h-[50vh] w-full items-center justify-center text-muted-foreground">
            <Loader2 className="mr-2 h-6 w-6 animate-spin" />
            Verificando permisos de administrador...
        </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-gray-900">Catálogos Maestros</h2>
        <p className="text-muted-foreground">Configuración global de marcas y reglas de caducidad por categoría.</p>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full max-w-[400px] grid-cols-2">
          <TabsTrigger value="categories">Categorías (Reglas)</TabsTrigger>
          <TabsTrigger value="brands">Marcas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="categories" className="mt-4">
          <CategoriesManager />
        </TabsContent>
        
        <TabsContent value="brands" className="mt-4">
          <BrandsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}