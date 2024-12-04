'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { format } from 'date-fns';
import { useTheme } from '@/app/providers/ThemeProvider';

interface ChartData {
  date: string;
  totalWeight: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const { theme } = useTheme();
  const lineColor = theme === 'dark' ? '#34D399' : '#059669';

  return (
    <div className="bg-white dark:bg-black rounded-md p-6 border border-gray-200 dark:border-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Performance Trend</h3>
      </div>
      
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
            <XAxis 
              dataKey="date" 
              tickFormatter={(value) => format(new Date(value), 'MMM d')}
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              tickFormatter={(value) => `${value}kg`}
              fontSize={12}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-sm p-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                        {format(new Date(label), 'PPP')}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Total Weight: <span className="font-medium">{payload[0].value}kg</span>
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Line
              type="monotone"
              dataKey="totalWeight"
              name="Total Weight"
              stroke={lineColor}
              strokeWidth={2}
              dot={{ r: 4, fill: lineColor }}
              activeDot={{ r: 6, fill: lineColor }}
              strokeOpacity={0.8}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}