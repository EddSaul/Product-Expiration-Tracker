import { create } from 'zustand';
import { supabase } from '@/config/supabaseClient';

export type UserRole = string | null;

interface StoreState {
  // --- AUTH STATE ---
  isAuthReady: boolean;
  userId: string | null;
  userRole: UserRole;
  
  // --- DATA STATE (Global Cache) ---
  users: any[];
  brands: any[];
  categories: any[];
  roles: any[];
  
  // Loading Flags
  hasLoadedCatalogs: boolean; 

  // --- ACTIONS ---
  setAuthReady: (ready: boolean) => void;
  setUserId: (id: string | null) => void;
  setUserRole: (role: UserRole) => void;

  // Fetch Actions
  fetchUsers: () => Promise<void>;
  fetchCatalogs: (force?: boolean) => Promise<void>;
  fetchRoles: () => Promise<void>;
  
  // Logging Action
  logAction: (action: string, details?: string) => Promise<void>;
}

export const useStore = create<StoreState>((set, get) => ({
  // Initial State
  isAuthReady: false,
  userId: null,
  userRole: null,
  users: [],
  brands: [],
  categories: [],
  roles: [],
  hasLoadedCatalogs: false,

  // Simple Setters
  setAuthReady: (ready) => set({ isAuthReady: ready }),
  setUserId: (id) => set({ userId: id }),
  setUserRole: (role) => set({ userRole: role }),

  // Loading Actions for Users
  fetchUsers: async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*, role:roles(role_name)')
      .order('full_name');
    
    if (!error && data) {
      set({ users: data });
    }
  },

  // Loading Actions for Catalogs
  fetchCatalogs: async (force = false) => {
    if (get().hasLoadedCatalogs && !force) return;

    const [brandsRes, catsRes] = await Promise.all([
      supabase.from('product_brands').select('*').order('name'),
      supabase.from('product_categories').select('*').order('name')
    ]);

    if (!brandsRes.error && !catsRes.error) {
      set({ 
        brands: brandsRes.data || [], 
        categories: catsRes.data || [],
        hasLoadedCatalogs: true 
      });
    }
  },

  // Loading Actions for Roles
  fetchRoles: async () => {
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .order('role_name');

    if (!error && data) {
      set({ roles: data });
    }
  },

  // Logging Action
  logAction: async (action, details) => {
    // Get the current user directly from the active session
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    try {
      await supabase.from('user_logs').insert({
        user_id: user.id,
        action: action.toUpperCase(), 
        details: details || null,
      });
    } catch (error) {
      console.error("Error creating log:", error);
    }
  }
}));