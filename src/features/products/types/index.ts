// 1. Category
export interface ProductCategory {
  id: number;
  name: string;
  company_id?: string;
  discount_intervals: number[];
  created_at: string;
}

// 2. Brand
export interface ProductBrand {
  id: number;
  name: string;
  participates_in_program: boolean;
  created_at: string;
}

// 3. Product Master (Catalog)
export interface ProductCatalogItem {
  id: string; // UUID
  barcode: string;
  name: string;
  brand_id: number;
  category_id: number;
  brand?: ProductBrand;
  category?: ProductCategory;
  exclude_from_program: boolean; 
  created_at: string;
}

// 4. Inventory Item (Main Table)
export interface InventoryItem {
  id: string;
  product_id: string;
  user_id: string;
  expiration_date: string;
  quantity: number;
  is_removed: boolean;
  removed_at?: string;
  product?: ProductCatalogItem; 
  created_at: string;
  updated_at?: string;
}

export type Option = { id: number; name: string };