import { supabase } from "@/config/supabaseClient";

export async function forceDeleteCatalogItem(id: number, type: 'brand' | 'category') {
    const filterColumn = type === 'brand' ? 'brand_id' : 'category_id';
    const tableToDelete = type === 'brand' ? 'product_brands' : 'product_categories';

    try {
        // 1. Search for products associated with the brand/category
        const { data: products } = await supabase.from('products').select('id').eq(filterColumn, id);
        const productIds = products?.map(p => p.id) || [];

        if (productIds.length > 0) {
            // 2. Delete inventory items of those products
            const { error: invError } = await supabase.from('inventory_items').delete().in('product_id', productIds);
            if (invError) throw new Error("Failed to delete inventory: " + invError.message);

            // 3. Delete products associated with the brand/category
            const { error: prodError } = await supabase.from('products').delete().in('id', productIds);
            if (prodError) throw new Error("Failed to delete products: " + prodError.message);
        }

        // 4. Finally, delete the Brand or Category
        const { error: mainError } = await supabase.from(tableToDelete).delete().eq('id', id);
        if (mainError) throw mainError;

        return { success: true };
    } catch (error: any) {
        return { success: false, message: error.message };
    }
}