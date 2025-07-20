import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface formatCurrencyParams {
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

export const formatCurrency = (
  value: number,
  {
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  }: formatCurrencyParams = {}
) => {
  return new Intl.NumberFormat('en-US', {
    signDisplay: 'never',
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(value);
};
