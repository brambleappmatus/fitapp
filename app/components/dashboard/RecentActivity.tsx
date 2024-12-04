'use client';

import { format } from 'date-fns';

interface Activity {
  id: string;
  name: string;
  date: string;
  score?: number;
}

interface RecentActivityProps {
  activities: Activity[];
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400">
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div 
          key={activity.id}
          className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/20 flex items-center justify-center">
              <span className="text-lg">{activity.score ? '💪' : '🏋️'}</span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {activity.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {format(new Date(activity.date), 'EEEE, MMM d, h:mm a')}
            </p>
          </div>
          {activity.score && (
            <div className="flex-shrink-0 text-lg" title={`Rating: ${activity.score}/5`}>
              {['😫', '😕', '😐', '🙂', '🤩'][activity.score - 1]}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}