'use client';

import { COLOR_PALETTE } from '@/lib/constants';
import { ChartData } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import {
  Cell,
  Pie,
  PieChart as PieChartComponent,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { ChartConfig, ChartContainer } from '../ui/chart';

interface RevenueSplitPieChartProps {
  data: ChartData[];
}

export const PieChart = ({ data }: RevenueSplitPieChartProps) => {
  if (!data || data.length === 0) {
    return <div className='text-center text-gray-500'>No data</div>;
  }

  /**
   * Process the data to ensure it has valid values and format them correctly.
   */
  const processedData = data
    .filter((item) => item.values !== 0) // Remove items with zero values
    .map((item) => ({
      ...item,
      values: typeof item.values === 'number' ? Math.abs(item.values) : 0, // Use absolute values for display, fallback to 0 if array
      originalValue: item.values, // Keep original value for reference
      name:
        typeof item.values === 'number' && item.values < 0
          ? `${item.name} (Credit)`
          : item.name, // Append "(Credit)" for negative values
    }));

  if (processedData.length === 0) {
    return (
      <div className='text-center text-gray-500'>No values to display</div>
    );
  }

  const chartConfig = {} satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className='h-[240px] w-full'>
      <PieChartComponent>
        <Pie
          className='text-sm font-semibold outline-0'
          data={processedData}
          cx='50%'
          cy='50%'
          labelLine={false}
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill='#8884d8'
          dataKey='values'
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
            />
          ))}
        </Pie>
        <Tooltip formatter={(value) => formatCurrency(Number(value))} />
      </PieChartComponent>
    </ChartContainer>
  );
};
