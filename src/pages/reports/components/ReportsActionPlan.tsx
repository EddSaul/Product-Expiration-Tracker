import { useMemo, useState } from "react";
import { Download, CalendarClock, Tag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { InventoryItem } from "@/features/products/types";
import { getActionPlan } from "@/features/products/utils/actionPlan";

interface ReportsActionPlanProps {
  items: InventoryItem[];
}

const RANGE_OPTIONS = [
  { label: "Próxima semana", value: 7 },
  { label: "Próximos 15 días", value: 15 },
  { label: "Próximo mes", value: 30 },
  { label: "Próximos 2 meses", value: 60 },
];

const fmtLong = (d: Date) =>
  d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

const fmtShort = (d: Date) =>
  d.toLocaleDateString("es-MX", { day: "2-digit", month: "2-digit", year: "numeric" });

const csvEscape = (value: string) =>
  /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;

export function ReportsActionPlan({ items }: ReportsActionPlanProps) {
  const [rangeDays, setRangeDays] = useState(30);

  const rows = useMemo(() => {
    return items
      .map((item) => ({ item, plan: getActionPlan(item) }))
      .filter(({ plan }) => plan.daysUntilAction <= rangeDays)
      .sort((a, b) => a.plan.actionDate.getTime() - b.plan.actionDate.getTime());
  }, [items, rangeDays]);

  const rangeLabel =
    RANGE_OPTIONS.find((o) => o.value === rangeDays)?.label.toLowerCase() ?? `${rangeDays} días`;

  const downloadCSV = () => {
    const headers = [
      "Producto",
      "Código de barras",
      "Categoría",
      "Marca",
      "Cantidad",
      "Caducidad",
      "Proceso",
      "Día indicado",
      "Estado",
      "Días para acción",
    ];

    const body = rows.map(({ item, plan }) => [
      item.product?.name ?? "",
      item.product?.barcode ?? "",
      item.product?.category?.name ?? "",
      item.product?.brand?.name ?? "",
      String(item.quantity),
      fmtShort(new Date(item.expiration_date)),
      plan.type === "discount" ? "Rebaja" : "Retiro",
      fmtShort(plan.actionDate),
      plan.statusLabel,
      String(plan.daysUntilAction),
    ]);

    const csv = [headers, ...body].map((r) => r.map(csvEscape).join(",")).join("\r\n");
    // BOM para que Excel respete los acentos (UTF-8).
    const blob = new Blob(["﻿" + csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `plan-salida-${rangeDays}d-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-xl border border-border bg-card shadow-sm break-inside-avoid">
      {/* Encabezado */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
            <CalendarClock className="h-5 w-5 text-blue-600" /> Plan de salida de productos
          </h3>
          <p className="text-sm text-muted-foreground">
            Productos a rebajar o retirar dentro del rango seleccionado, con el día indicado para sacarlos.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden">
          <select
            value={rangeDays}
            onChange={(e) => setRangeDays(Number(e.target.value))}
            className="h-9 rounded-md border border-border bg-card px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          >
            {RANGE_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Button onClick={downloadCSV} variant="outline" className="gap-2 text-xs md:text-sm" disabled={rows.length === 0}>
            <Download className="h-4 w-4" /> Descargar CSV
          </Button>
        </div>
      </div>

      {/* Subtítulo de impresión / conteo */}
      <div className="px-4 pt-3 text-sm text-muted-foreground">
        {rows.length} producto{rows.length === 1 ? "" : "s"} a procesar en {rangeLabel}.
      </div>

      {/* Tabla */}
      <div className="p-4 pt-2">
        {rows.length === 0 ? (
          <div className="py-10 text-center text-sm text-muted-foreground">
            No hay productos pendientes en este rango. 🎉
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead>Producto</TableHead>
                <TableHead>Categoría</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead className="text-center">Cant.</TableHead>
                <TableHead>Caduca</TableHead>
                <TableHead>Proceso</TableHead>
                <TableHead>Día indicado</TableHead>
                <TableHead className="text-center">Faltan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(({ item, plan }) => {
                const overdue = plan.daysUntilAction <= 0;
                return (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-foreground">
                      {item.product?.name}
                      <span className="block text-[11px] font-normal text-muted-foreground">
                        {item.product?.barcode}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{item.product?.category?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">{item.product?.brand?.name ?? "—"}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-muted-foreground">{fmtShort(new Date(item.expiration_date))}</TableCell>
                    <TableCell>
                      {plan.type === "discount" ? (
                        <Badge variant="outline" className="gap-1 border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300">
                          <Tag className="h-3 w-3" /> Rebaja
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="gap-1 border-red-300 bg-red-50 text-red-800 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
                          <Trash2 className="h-3 w-3" /> Retiro
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className={overdue ? "font-semibold text-red-700 dark:text-red-400" : "text-foreground"}>
                      {fmtLong(plan.actionDate)}
                    </TableCell>
                    <TableCell className="text-center">
                      <span
                        className={
                          overdue
                            ? "font-semibold text-red-700 dark:text-red-400"
                            : plan.daysUntilAction <= 3
                            ? "font-semibold text-amber-700 dark:text-amber-400"
                            : "text-muted-foreground"
                        }
                      >
                        {overdue ? "¡Ya!" : `${plan.daysUntilAction} d`}
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </div>
    </section>
  );
}
