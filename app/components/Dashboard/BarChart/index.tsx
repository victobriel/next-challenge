'use client';

import { COLOR_PALETTE } from "@/lib/constants";
import { ChartData } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { Bar, BarChart as BarChartComponent, CartesianGrid, Legend, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface BarChartProps {
	data: (ChartData | null)[];
	dateArray: string[];
}

export const BarChart = ({ data, dateArray }: BarChartProps) => {
	if (!data || data.length === 0) {
		return <div className="text-center text-gray-500">No expense data available</div>;
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
      // Verificação de null/undefined antes de acessar propriedades
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
      } else if (item) {
        // Handle cases where data might be missing for this date
        const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
        dataPoint[safeKey] = null;
        dataPoint[`${safeKey}_original`] = item.name;
      }
    });
    
    return dataPoint;
  });

  const validData = data.filter((item): item is ChartData => item !== null);
  
  const hasValidData = chartData.some(point => 
    validData.some(item => {
      const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
      return point[safeKey] !== null && point[safeKey] !== undefined;
    })
  );

  if (!hasValidData) {
    return <div className="text-center text-gray-500">No valid data to display</div>;
  }

	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChartComponent
				data={chartData}
				className="text-xs"
				layout={"horizontal"}
				margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
			>
				<CartesianGrid strokeDasharray="3 3" />
				<XAxis dataKey="date" type="category" />
				<YAxis tickFormatter={(value) => formatCurrency(value)} className="text-xs" />
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
				<ReferenceLine y={0} stroke="#000" />

				{validData.map((item, index) => {
					// Use a safe key for the dataKey to avoid issues with special characters
					const safeKey = item.name.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
					return (
						<Bar
							key={item.name}
							dataKey={safeKey}
							stackId="a"
							fill={COLOR_PALETTE[index % COLOR_PALETTE.length]}
							name={safeKey}
							isAnimationActive={false}
						/>
					);
				})}
			</BarChartComponent>
		</ResponsiveContainer>
	);
}
