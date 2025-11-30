import * as z from "zod";

export const formSchema = z.object({
  barcode: z.string().min(4, "Mínimo 4 caracteres"),
  name: z.string().min(3, "Nombre requerido"),
  brand_id: z.string().min(1, "Marca requerida"),
  category_id: z.string().min(1, "Categoría requerida"),
  expiration_date: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
  quantity: z.coerce.number().min(1, "Mínimo 1 pieza"),
});

export type InventoryFormValues = z.infer<typeof formSchema>;