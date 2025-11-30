import type { InventoryItem } from "../types";

export function calculateProductStatus(item: InventoryItem) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const expTime = new Date(item.expiration_date).setHours(0, 0, 0, 0);
  
  const diffTime = expTime - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // Check if the brand participates in the discount program
  const brandParticipates = item.product?.brand?.participates_in_program;
  
  // Verify if the product is excluded from the program
  const isExcluded = item.product?.exclude_from_program;

  // Determine if the product is in the discount program
  const isProgram = brandParticipates && !isExcluded;

  const rules = item.product?.category?.discount_intervals || [];
  const sortedRules = [...rules].sort((a: number, b: number) => b - a);
  const maxRuleDays = sortedRules.length > 0 ? sortedRules[0] : 0;

  let status: 'expired' | 'risk' | 'discount' | 'ok' = 'ok';
  let action = "";
  let priority = 3; 

  if (daysLeft < 0) {
    status = 'expired';
    action = "Retirar inmediatamente";
    priority = 1;
  } else if (isProgram && daysLeft <= maxRuleDays) {
    status = 'discount';
    const currentStage = sortedRules.find((rule: number) => daysLeft <= rule) || maxRuleDays;
    action = `Aplicar Rebaja (${currentStage} días)`;
    priority = 2;
  } else if (!isProgram && daysLeft <= 7) {
    // If not in program, only risk if within 7 days
    status = 'risk';
    action = "Retirar (Próximo a vencer)";
    priority = 1;
  }

  return { status, daysLeft, action, priority, isProgram };
}