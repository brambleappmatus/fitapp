'use client';

import { useState } from 'react';

export default function ActivityChart() {
  const [timeframe, setTimeframe] = useState<'weekly' | 'yearly'>('weekly');

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Fitness Activity</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setTimeframe('weekly')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === 'weekly'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Weekly
          </button>
          <button
            onClick={() => setTimeframe('yearly')}
            className={`px-3 py-1 text-sm rounded-full ${
              timeframe === 'yearly'
                ? 'bg-blue-100 text-blue-600'
                : 'text-gray-500'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-2">
        {[65, 45, 75, 50, 80, 45, 70].map((height, index) => (
          <div key={index} className="w-full flex flex-col items-center gap-1">
            <div className="w-full flex flex-col items-center gap-1">
              <div
                className="w-full bg-blue-600 rounded-sm"
                style={{ height: `${height}%` }}
              ></div>
              <div
                className="w-full bg-blue-200 rounded-sm"
                style={{ height: `${height * 0.3}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-500">
              {['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}