export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      // ROLES & PROFILES
      profiles: {
        Row: {
          id: string
          employee_id: string
          full_name: string
          role_id: number
          created_at: string
          last_sign_in_at: string | null
        }
        Insert: {
          id: string
          employee_id: string
          full_name: string
          role_id: number
          created_at?: string
          last_sign_in_at?: string | null
        }
        Update: {
          id?: string
          employee_id?: string
          full_name?: string
          role_id?: number
          created_at?: string
          last_sign_in_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          }
        ]
      }
      roles: {
        Row: {
          id: number
          role_name: string
          created_at: string
        }
        Insert: {
          id?: never
          role_name: string
          created_at?: string
        }
        Update: {
          id?: never
          role_name?: string
          created_at?: string
        }
        Relationships: []
      }

      // PRODUCTS & CATALOGS
      product_categories: {
        Row: {
          id: number
          name: string
          company_id: string | null
          discount_intervals: number[] | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: never
          name: string
          company_id?: string | null
          discount_intervals?: number[] | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: never
          name?: string
          company_id?: string | null
          discount_intervals?: number[] | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_brands: {
        Row: {
          id: number
          name: string
          participates_in_program: boolean
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: never
          name: string
          participates_in_program?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: never
          name?: string
          participates_in_program?: boolean
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          id: string
          name: string
          barcode: string
          brand_id: number
          category_id: number
          image_url: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          barcode: string
          brand_id: number
          category_id: number
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          barcode?: string
          brand_id?: number
          category_id?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "products_brand_id_fkey"
            columns: ["brand_id"]
            referencedRelation: "product_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            referencedRelation: "product_categories"
            referencedColumns: ["id"]
          }
        ]
      }
      inventory_items: {
        Row: {
          id: string
          product_id: string
          user_id: string
          expiration_date: string
          quantity: number
          is_removed: boolean
          removed_at: string | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          product_id: string
          user_id: string
          expiration_date: string
          quantity?: number
          is_removed?: boolean
          removed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          product_id?: string
          user_id?: string
          expiration_date?: string
          quantity?: number
          is_removed?: boolean
          removed_at?: string | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_items_product_id_fkey"
            columns: ["product_id"]
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_items_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }

      // NEW TABLE: USER LOGS (ADMINISTRATION)
      user_logs: {
        Row: {
          id: string
          user_id: string
          action: string
          details: string | null
          ip_address: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          details?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          details?: string | null
          ip_address?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_logs_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles" 
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}