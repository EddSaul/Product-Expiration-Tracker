import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner"; 
import LoginPage from "./pages/LoginPage";
import DashboardLayout from "./layouts/DashboardLayout"; 
import DashboardHome from "./pages/DashboardHome";
import ProductsPage from "./pages/ProductsPage";
import AdminCatalogsPage from "./pages/admin/AdminCatalogsPage";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import ReportsPage from "./pages/reports/ReportsPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Private Routes*/}
        <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardHome />} />
            <Route path="/dashboard/productos" element={<ProductsPage />} />
            <Route path="/dashboard/reportes" element={<ReportsPage />} />
            {/* Admin Routes */}
            <Route path="/dashboard/admin/usuarios" element={<AdminUsersPage />} />
            <Route path="/dashboard/admin/catalogos" element={<AdminCatalogsPage />} />
        </Route>
        
        {/* Handle Not Found Routes (404) */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
      
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}

export default App;