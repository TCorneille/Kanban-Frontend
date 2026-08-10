import React from 'react';
import { BsLayers } from 'react-icons/bs';
import { LuListTodo } from 'react-icons/lu';
import { CiCircleCheck } from 'react-icons/ci';
import { GoClock } from 'react-icons/go';
import { useGetDashboardStatsQuery} from '../app/api/workspace';

type StatCardProps = {
  icon: React.ReactNode;
  value: number;
  label: string;
  isLoading: boolean;
};

const StatCard: React.FC<StatCardProps> = ({ icon, value, label, isLoading }) => {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-slate-800 bg-slate-900/70 p-4 shadow-sm shadow-slate-950/20">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-sky-500/10 text-sky-400">
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-2xl font-semibold text-white">
          {isLoading ? '...' : value}
        </div>
        <div className="text-sm text-slate-400">{label}</div>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const { data: stats, isLoading, isError } = useGetDashboardStatsQuery();

  const statsData = [
    {
      id: 'workspaces',
      icon: <BsLayers className="w-5 h-5" />,
      value: stats?.workspaces ?? 0,
      label: 'Workspaces',
    },
    {
      id: 'open-tasks',
      icon: <LuListTodo className="w-5 h-5" />,
      value: stats?.openTasks ?? 0,
      label: 'Open tasks',
    },
    {
      id: 'completed',
      icon: <CiCircleCheck className="w-5 h-5" />,
      value: stats?.completedTasks ?? 0,
      label: 'Completed',
    },
    {
      id: 'overdue',
      icon: <GoClock className="w-5 h-5" />,
      value: stats?.overdueTasks ?? 0,
      label: 'Overdue',
    },
  ];

  if (isError) {
    return (
      <div className="p-4 bg-red-950/40 border border-red-800 text-red-400 rounded-xl text-sm">
        Failed to load statistics
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            isLoading={isLoading}
          />
        ))}
      </div>
    </div>
  );
};