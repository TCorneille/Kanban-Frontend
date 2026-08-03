import React from 'react';
import { BsLayers } from 'react-icons/bs';
import { LuListTodo } from 'react-icons/lu';
import { CiCircleCheck } from 'react-icons/ci';
import { GoClock } from 'react-icons/go';

interface StatCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#13161c] border border-[#1e232d] shadow-sm min-w-[200px] flex-1">
      {/* Icon Wrapper */}
      <div className="flex items-center justify-center p-3 rounded-xl bg-[#1a1f29] text-amber-500">
        {icon}
      </div>

      {/* Content */}
      <div className="flex flex-col">
        <span className="text-2xl font-bold text-white leading-tight">
          {value}
        </span>
        <span className="text-sm font-medium text-slate-400">
          {label}
        </span>
      </div>
    </div>
  );
};

export const DashboardStats: React.FC = () => {
  const statsData = [
    {
      id: 'workspaces',
      icon: <BsLayers className="w-5 h-5" />,
      value: 0,
      label: 'Workspaces',
    },
    {
      id: 'open-tasks',
      icon: <LuListTodo className="w-5 h-5" />,
      value: 0,
      label: 'Open tasks',
    },
    {
      id: 'completed',
      icon: <CiCircleCheck className="w-5 h-5" />,
      value: 0,
      label: 'Completed',
    },
    {
      id: 'overdue',
      icon: <GoClock className="w-5 h-5" />,
      value: 0,
      label: 'Overdue',
    },
  ];

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl">
        {statsData.map((stat) => (
          <StatCard
            key={stat.id}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
          />
        ))}
      </div>
    </div>
  );
};

export default DashboardStats;