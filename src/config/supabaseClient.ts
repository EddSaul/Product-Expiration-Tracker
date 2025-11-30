import { createClient } from "@supabase/supabase-js";
import type { Database } from "../types/supabase"; 

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Variables validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Falta configurar las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY en el archivo .env"
  );
}

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
);


supabase.auth.onAuthStateChange((_event, _session) => {
  // State change handler (currently empty)
});
