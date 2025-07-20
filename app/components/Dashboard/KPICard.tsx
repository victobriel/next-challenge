import { KPI, TopKPI } from '@/lib/types';
import { cn, formatCurrency } from '@/lib/utils';
import { TrendingDown, TrendingUp } from 'lucide-react';

type KPICardProps = KPICardTop | KPICardRegular;

interface KPICardTop {
  kpi: TopKPI;
  isTopKpi: true;
}

interface KPICardRegular {
  kpi: KPI;
  isTopKpi?: false;
}

export const KPICard = ({ kpi, isTopKpi }: KPICardProps) => {
  const isPositive = isTopKpi
    ? Number(kpi.mOm || 0) >= 0
    : Number(kpi.mom || 0) >= 0;
  const percentage = isTopKpi ? Number(kpi.mOm) : Number(kpi.mom);

  return (
    <div
      className={cn(
        'relative space-y-2 rounded-lg border bg-white px-6 py-4 shadow-sm',
        isTopKpi &&
          'border-amber-500 bg-gradient-to-br from-yellow-50 to-yellow-100 shadow-lg'
      )}
    >
      <p className='text-foreground text-sm font-medium'>{kpi.name}</p>
      <p className='text-kdwa-foreground text-center text-3xl font-bold'>
        {formatCurrency(kpi.value)}
      </p>
      {percentage !== undefined && !isNaN(percentage) ? (
        <>
          <div
            className={cn(
              'mx-auto mt-1 flex w-fit items-center rounded-full px-3 py-1',
              isPositive
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            )}
          >
            {isPositive ? (
              <TrendingUp className='mr-1 h-4 w-4' />
            ) : (
              <TrendingDown className='mr-1 h-4 w-4' />
            )}
            <span className='text-sm font-medium'>
              {Math.abs(percentage).toFixed(1)}%
            </span>
          </div>
        </>
      ) : (
        <p className='text-sm text-gray-500'>No data</p>
      )}
    </div>
  );
};
