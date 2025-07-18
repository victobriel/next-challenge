'use client';

import { COLOR_PALETTE } from "@/lib/constants";
import { ChartData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { CartesianGrid, Legend, Line, LineChart as LineChartComponent, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface LineChartProps {
	data: ChartData[];
  dateArray?: string[];
  showLabel?: boolean;
}

export const LineChart = ({ data, dateArray, showLabel }: LineChartProps) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No data</div>;
  }

  if (!dateArray || dateArray.length === 0) {
    return <div className="text-center text-gray-500">No date periods provided</div>;
  }

  /**
   * Organize the data into a format suitable for recharts.
   */
  const chartData = dateArray.map((date, dateIndex) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dataPoint: any = { date };
    
    data.forEach((item) => {
      if (
        item &&
        Array.isArray(item.values) &&
        item.values[dateIndex] !== undefined
      ) {
        // Create a safe key name for the data point
        const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        dataPoint[safeKey] = item.values[dateIndex];
        
        // Also store original name for reference
        dataPoint[`${safeKey}_original`] = item.name;
      } else {
        // Handle cases where data might be missing for this date
        const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        dataPoint[safeKey] = null;
        dataPoint[`${safeKey}_original`] = item.name;
      }
    });
    
    return dataPoint;
  });

  const hasValidData = chartData.some(point => 
    data.some(item => {
      const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      return point[safeKey] !== null && point[safeKey] !== undefined;
    })
  );

  if (!hasValidData) {
    return <div className="text-center text-gray-500">No valid data to display</div>;
  }

	return (
    <div className="w-full h-full max-h-[310px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChartComponent
          className="text-sm"
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date"
            label={showLabel ? { value: 'Period', position: 'insideBottom', offset: -10 } : undefined}
          />
          <YAxis 
            label={showLabel ? { value: 'Amount ($)', angle: -90, position: 'insideLeft' } : undefined}
            tickFormatter={(value) => formatCurrency(Number(value))}
          />
          <Legend 
            formatter={(value: string) => {
              // Try to find the original name for better legend display
              const originalNameKey = `${value}_original`;
              const originalName = chartData[0]?.[originalNameKey] || value;
              return originalName;
            }}
          />
          <Tooltip 
            labelClassName="font-semibold underline"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: any, name: string) => {
              // Try to find the original name for better tooltip display
              const originalNameKey = `${name}_original`;
              const originalName = chartData[0]?.[originalNameKey] || name;
              return [
                value !== null && value !== undefined ? formatCurrency(Number(value)) : 'N/A',
                originalName
              ];
            }}
          />

          {data.map((item, index) => {
            const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
            return (
              <Line
                key={item.name}
                type="monotone"
                dataKey={safeKey}
                stroke={COLOR_PALETTE[index % COLOR_PALETTE.length]}
                strokeWidth={2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
                name={safeKey}
              />
            );
          })}
        </LineChartComponent>
      </ResponsiveContainer>
    </div>
	)
}
