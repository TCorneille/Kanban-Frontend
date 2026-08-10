import React from 'react';
import { useGetMyActivitiesQuery } from '../app/api/activity';
import type { ActivityLog } from '../app/api/activity';

interface ActivityCardProps {
  title?: string;
  limit?: number;
  activities?: ActivityLog[];
}

const getActionBadgeStyle = (actionType: string): string => {
  switch (actionType) {
    case 'TASK_CREATED':
    case 'BOARD_CREATED':
    case 'WORKSPACE_CREATED':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    case 'TASK_MOVED':
      return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
    case 'TASK_UPDATED':
    case 'BOARD_UPDATED':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    case 'TASK_DELETED':
    case 'BOARD_DELETED':
      return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
    default:
      return 'bg-slate-800 text-slate-300 border-slate-700/60';
  }
};

const formatRelativeTime = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (isNaN(diffInSeconds)) return dateString;
    if (diffInSeconds < 60) return 'Just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return dateString;
  }
};

const getUserDisplayName = (user: any): string => {
  if (!user) return 'You';
  if (typeof user === 'object') return user.name || user.email || 'You';
  if (typeof user === 'string' && user.length === 24 && /^[0-9a-fA-F]{24}$/.test(user)) return 'You';
  return String(user);
};

export const ActivityCard: React.FC<ActivityCardProps> = ({
  title = 'Activity',
  limit = 4,
  activities: initialActivities,
}) => {
  const {
    data: fetchedActivities = [],
    isLoading,
    isError,
    error,
  } = useGetMyActivitiesQuery(limit, {
    skip: Boolean(initialActivities),
  });

  const activities = initialActivities || fetchedActivities;

  return (
    <div className="w-full max-w-xl rounded-2xl bg-[#13161c] border border-[#1e232d] p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
        {activities.length > 0 && (
          <span className="text-xs font-medium text-slate-400 bg-[#1e232d] px-2.5 py-1 rounded-full border border-[#2a303c]">
            {activities.length} recent
          </span>
        )}
      </div>

      {isLoading && (
        <div className="space-y-4 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col gap-2">
              <div className="h-4 bg-[#1e232d] rounded w-3/4" />
              <div className="h-3 bg-[#1e232d]/60 rounded w-1/4" />
            </div>
          ))}
        </div>
      )}

      {!isLoading && isError && (
        <div className="text-sm text-rose-400 bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
          {(error as any)?.data?.message || 'Failed to load activity log'}
        </div>
      )}

      {!isLoading && !isError && activities.length === 0 && (
        <div className="py-8 text-center flex flex-col items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-[#1e232d] flex items-center justify-center mb-3 text-slate-500">
            ⚡
          </div>
          <p className="text-sm font-medium text-slate-400">No recent activity found.</p>
        </div>
      )}

      {!isLoading && !isError && activities.length > 0 && (
        <div className="space-y-4">
          {activities.map((item) => {
            const userName = getUserDisplayName(item.user);
            const badgeStyle = getActionBadgeStyle(item.actionType);
            const boardName =
              item.board && typeof item.board === 'object'
                ? item.board.title || item.board.name
                : null;

            return (
              <div
                key={item.id || item._id}
                className="flex flex-col pb-3 border-b border-[#1e232d]/60 last:border-0 last:pb-0"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="text-sm font-medium text-slate-400 flex items-center flex-wrap gap-1.5">
                    <span className="font-semibold text-white">{userName}</span>
                    <span className="text-slate-300">{item.details}</span>

                    {boardName && (
                      <span className="text-xs text-slate-500 bg-[#1a1f28] px-1.5 py-0.5 rounded border border-[#262c38]">
                        {boardName}
                      </span>
                    )}
                  </div>

                  <span
                    className={`shrink-0 font-semibold uppercase text-[10px] tracking-wider px-2 py-0.5 rounded border inline-block ${badgeStyle}`}
                  >
                    {item.actionType ? item.actionType.replace(/_/g, ' ') : 'ACTION'}
                  </span>
                </div>

                <span className="text-xs text-slate-500 font-normal mt-1">
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ActivityCard;