'use client';

interface Stat {
  label: string;
  value: string | number;
  change?: number;
  icon: (props: { className?: string }) => JSX.Element;
}

interface StatsGridProps {
  stats: Stat[];
}

export default function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white dark:bg-black rounded-md p-6 border border-gray-200 dark:border-gray-800"
        >
          <div className="flex items-center">
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-md">
              <stat.icon className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
              <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              {stat.change !== undefined && (
                <p className={`mt-1 text-sm ${
                  stat.change >= 0 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-red-600 dark:text-red-400'
                }`}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}