import React from 'react';

export interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
}

interface ActivityCardProps {
  /** Title header for the card */
  title?: string;
  /** List of activity items */
  activities?: ActivityItem[];
}

const defaultActivities: ActivityItem[] = [
  {
    id: '1',
    user: 'Twagirimana Corneille',
    action: 'created board',
    target: '"New board"',
    timestamp: '8/2/2026, 11:53:52 AM',
  },
  {
    id: '2',
    user: 'Twagirimana Corneille',
    action: 'created board',
    target: '"New board"',
    timestamp: '8/2/2026, 11:53:48 AM',
  },
  {
    id: '3',
    user: 'Twagirimana Corneille',
    action: 'created board',
    target: '"avsz"',
    timestamp: '8/2/2026, 10:51:23 AM',
  },
  {
    id: '4',
    user: 'Twagirimana Corneille',
    action: 'created board',
    target: '"New board"',
    timestamp: '8/2/2026, 10:46:15 AM',
  },
  {
    id: '5',
    user: 'Twagirimana Corneille',
    action: 'created workspace',
    target: '"adabbbbab"',
    timestamp: '8/2/2026, 10:26:55 AM',
  },
];

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title = 'Activity',
  activities = defaultActivities,
}) => {
  return (
    <div className="w-full max-w-xl rounded-2xl bg-[#13161c] border border-[#1e232d] p-6 shadow-sm">
      {/* Card Header */}
      <h2 className="text-xl font-bold text-white mb-6 tracking-tight">
        {title}
      </h2>

      {/* Activity List */}
      <div className="space-y-4">
        {activities.map((item) => (
          <div key={item.id} className="flex flex-col">
            {/* User action description */}
            <div className="text-sm font-medium text-slate-400">
              <span className="font-semibold text-white">{item.user}</span>{' '}
              <span>{item.action}</span>{' '}
              <span className="text-white">{item.target}</span>
            </div>

            {/* Timestamp */}
            <span className="text-xs text-slate-500 font-normal mt-0.5">
              {item.timestamp}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityCard;