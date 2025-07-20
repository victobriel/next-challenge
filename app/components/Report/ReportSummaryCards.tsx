'use client';

import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { BarChart3, DollarSign, TrendingDown, TrendingUp } from 'lucide-react';

import { formatCurrency } from '@/lib/utils';
import { getReportPeriod } from '@/redux/report-period/slice';
import {
  calculateTotalByIndex,
  getTextColor,
} from '@/app/report/reports/utils/report-utils';
import { FinanceMovement } from '@/lib/types';

interface ReportSummaryCardsProps {
  report: {
    profitnLoss: FinanceMovement[];
  };
}

const CARD_ICONS = [
  TrendingDown, // Expenses
  DollarSign, // Income
  BarChart3, // Other Expenses
  TrendingUp, // Cost of Sales
  TrendingUp, // Revenues
] as const;

const CARD_LABELS = [
  'Total Expenses',
  'Total Income',
  'Other Expenses',
  'Cost of Sales',
  'Total Revenues',
] as const;

export function ReportSummaryCards({ report }: ReportSummaryCardsProps) {
  const period = useSelector(getReportPeriod);

  const cardData = useMemo(() => {
    return report.profitnLoss.map((field, index) => ({
      name: field.name,
      type: field.type,
      total: calculateTotalByIndex(report.profitnLoss, index, period),
      icon: CARD_ICONS[index],
      label: CARD_LABELS[index],
    }));
  }, [report.profitnLoss, period]);

  return (
    <div className='mb-8 grid grid-cols-1 gap-2 md:grid-cols-4 lg:grid-cols-5'>
      {cardData.map((card, index) => {
        const Icon = card.icon;
        const textColor = getTextColor(card.type);

        return (
          <div
            key={`${card.name}-${index}`}
            className='bg-card flex flex-col justify-between rounded-lg border bg-gradient-to-br from-yellow-50 to-yellow-100 px-6 py-4 shadow-md transition-shadow hover:shadow-md'
          >
            <div className='flex w-full items-center justify-between'>
              <p className='text-card-foreground font-medium'>{card.name}</p>
              <Icon className={`size-6 ${textColor}`} aria-hidden='true' />
            </div>

            <div className='mt-3 flex items-center justify-between'>
              <p className={`text-2xl font-bold ${textColor}`}>
                {formatCurrency(card.total)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
