import { FinanceMovement } from '@/lib/types';

export const FINANCE_TYPE_CONFIG = {
  expenses: {
    label: 'Expense',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  income: {
    label: 'Income',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
  costOfSales: {
    label: 'Cost of Sales',
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
  },
  otherExpenses: {
    label: 'Other Expense',
    color: 'text-red-500',
    bgColor: 'bg-red-100',
  },
  otherIncome: {
    label: 'Other Income',
    color: 'text-green-500',
    bgColor: 'bg-green-100',
  },
} as const;

export type FinanceType = keyof typeof FINANCE_TYPE_CONFIG;

export function getTypeLabel(type: string): string {
  return FINANCE_TYPE_CONFIG[type as FinanceType]?.label || '';
}

export function getTextColor(type: string): string {
  return FINANCE_TYPE_CONFIG[type as FinanceType]?.color || '';
}

export function getBgColor(type: string): string {
  return FINANCE_TYPE_CONFIG[type as FinanceType]?.bgColor || '';
}

export function calculateTotalByIndex(
  profitLossData: FinanceMovement[],
  index: number,
  period: string
): number {
  const item = profitLossData[index];
  if (!item) return 0;

  let data: number[] = [];
  switch (period) {
    case 'quarterly':
      data = item.quarterly || [];
      break;
    case 'yearly':
      data = item.yearly || [];
      break;
    default:
      data = item.totalResult || [];
      break;
  }

  return data.reduce((total, value) => total + (value || 0), 0);
}
