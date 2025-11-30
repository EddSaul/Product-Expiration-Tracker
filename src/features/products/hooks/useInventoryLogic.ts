import { useState } from "react";
import { useForm, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/config/supabaseClient";
import { useStore } from "@/store/useStore";
import { formSchema, type InventoryFormValues } from "../components/inventorySchema";

export function useInventoryLogic(onSaved: () => void) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [existingProduct, setExistingProduct] = useState<any | null>(null);
  const [lastAddedItem, setLastAddedItem] = useState<{name: string, quantity: number, expiration: string} | null>(null);

  // Initial values for brand and category selects
  const [initialBrands, setInitialBrands] = useState<{id: number, name: string}[]>([]);
  const [initialCategories, setInitialCategories] = useState<{id: number, name: string}[]>([]);

  const { logAction } = useStore();

  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(formSchema) as Resolver<InventoryFormValues>,
    defaultValues: {
      barcode: "", name: "", quantity: 1,
      expiration_date: new Date().toISOString().split('T')[0], 
      brand_id: "", category_id: "",  
    },
  });

  // Functions to search brands and categories
  
  const searchBrands = async (query: string) => {
    let queryBuilder = supabase
        .from("product_brands")
        .select("id, name")
        .limit(10); // Fetch only 10 for speed

    if (query) {
        queryBuilder = queryBuilder.ilike("name", `%${query}%`);
    } else {
        queryBuilder = queryBuilder.order("name", { ascending: true });
    }

    const { data } = await queryBuilder;
    return data || [];
  };

  const searchCategories = async (query: string) => {
    let queryBuilder = supabase
        .from("product_categories")
        .select("id, name")
        .limit(20);

    if (query) {
        queryBuilder = queryBuilder.ilike("name", `%${query}%`);
    } else {
        queryBuilder = queryBuilder.order("name", { ascending: true });
    }
    
    const { data } = await queryBuilder;
    return data || [];
  };

  const searchProduct = async (barcode: string) => {
    if (!barcode || barcode.length < 4) return;
    setIsSearching(true);
    setExistingProduct(null);

    const { data } = await supabase.from("products").select(`
        *,
        brand:product_brands(id, name),
        category:product_categories(id, name)
    `).eq("barcode", barcode).single();

    setIsSearching(false);

    if (data) {
      setExistingProduct(data);
      form.setValue("name", data.name);
      form.setValue("brand_id", data.brand_id.toString());
      form.setValue("category_id", data.category_id.toString());
      
      // Pre-fill initial lists so the select shows the correct name
      if (data.brand) setInitialBrands([data.brand]);
      if (data.category) setInitialCategories([data.category]);
    }
  };

  const handleScanResult = (text: string) => {
    setShowScanner(false);
    form.setValue("barcode", text);
    searchProduct(text);
    if (navigator.vibrate) navigator.vibrate(200);
  };

  const onFormSubmit = async (values: InventoryFormValues) => {
    setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Usuario no autenticado");

      let productId = existingProduct?.id;

      if (!existingProduct) {
        const { data: newProd, error: createErr } = await supabase.from("products").insert({
            barcode: values.barcode, name: values.name,
            brand_id: parseInt(values.brand_id), category_id: parseInt(values.category_id),
        }).select().single();
        if (createErr) throw createErr;
        productId = newProd.id;
      }

      const { error: invErr } = await supabase.from("inventory_items").insert({
          product_id: productId, user_id: user.id,
          expiration_date: values.expiration_date, quantity: values.quantity,
      });
      if (invErr) throw invErr;

      logAction(existingProduct ? 'ADD_STOCK' : 'CREATE_PRODUCT', `Añadió ${values.quantity}: ${values.name}`);
      
      onSaved();
      setLastAddedItem({ name: values.name, quantity: values.quantity, expiration: values.expiration_date });
      setIsOpen(false);
      
      form.reset({
         barcode: "", name: "", quantity: 1,
         expiration_date: new Date().toISOString().split('T')[0],
         brand_id: "", category_id: "",
      });
      setExistingProduct(null);
      setInitialBrands([]); 
      setInitialCategories([]);

    } catch (e: any) {
      alert("Error: " + e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isOpen, setIsOpen,
    isLoading, isSearching,
    showScanner, setShowScanner,
    existingProduct,
    initialBrands, initialCategories,
    searchBrands, searchCategories,   
    form,
    searchProduct,
    handleScanResult,
    onFormSubmit,
    lastAddedItem,
    setLastAddedItem
  };
}