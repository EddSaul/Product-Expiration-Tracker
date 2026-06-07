import type { InventoryItem } from "../types";

export type ProcessType = "discount" | "removal";

export interface ActionPlan {
  /** Días hasta la caducidad (negativo = ya caducado). */
  daysLeft: number;
  /** ¿El producto participa en el programa de rebajas? */
  isProgram: boolean;
  /** Tipo de proceso a realizar: rebaja o retiro. */
  type: ProcessType;
  /** Día indicado para sacar el producto y realizar su proceso. */
  actionDate: Date;
  /** Días desde hoy hasta la fecha de acción (negativo = ya debió hacerse). */
  daysUntilAction: number;
  /** Días de anticipación de la rebaja (intervalo mayor de la categoría). */
  discountDays: number;
  /** Etiqueta de estado legible. */
  statusLabel: string;
}

const DAY_MS = 1000 * 60 * 60 * 24;

const atMidnight = (d: Date) => {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
};

/**
 * Calcula el plan de salida de un artículo de inventario: cuándo y cómo debe
 * sacarse para su debido proceso (rebaja si participa en el programa, o retiro
 * por caducidad si no). La fecha de rebaja se calcula restando a la caducidad
 * el mayor intervalo de descuento de su categoría.
 */
export function getActionPlan(item: InventoryItem, now: Date = new Date()): ActionPlan {
  const today = atMidnight(now);
  const exp = atMidnight(new Date(item.expiration_date));

  const daysLeft = Math.ceil((exp.getTime() - today.getTime()) / DAY_MS);

  const brandParticipates = item.product?.brand?.participates_in_program;
  const isExcluded = item.product?.exclude_from_program;
  const isProgram = !!brandParticipates && !isExcluded;

  const rules = item.product?.category?.discount_intervals ?? [];
  const discountDays = isProgram && rules.length > 0 ? Math.max(...rules) : 0;

  const type: ProcessType = discountDays > 0 ? "discount" : "removal";

  const actionDate = new Date(exp);
  if (type === "discount") {
    actionDate.setDate(actionDate.getDate() - discountDays);
  }

  const daysUntilAction = Math.ceil((actionDate.getTime() - today.getTime()) / DAY_MS);

  let statusLabel: string;
  if (daysLeft < 0) {
    statusLabel = "Caducado";
  } else if (type === "discount") {
    statusLabel = daysUntilAction <= 0 ? "En rebaja" : "Por rebajar";
  } else {
    statusLabel = "Por retirar";
  }

  return { daysLeft, isProgram, type, actionDate, daysUntilAction, discountDays, statusLabel };
}
