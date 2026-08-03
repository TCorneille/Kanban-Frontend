import React from 'react';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';

export interface CardProps {
  /** React-icons icon component (e.g., FiColumns from 'react-icons/fi') */
  icon: IconType;
  /** Main card header */
  title: string;
  /** Secondary description text */
  description?: string;
  /** Optional custom content if you need to pass additional elements */
  children?: ReactNode;
  /** Optional additional CSS classes for custom styling */
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  description,
  children,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl border border-zinc-800/80 bg-[#12141a] p-6 text-left shadow-lg transition-all hover:border-zinc-700 ${className}`}
    >
      {/* Icon Badge */}
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-500">
        <Icon className="h-5 w-5" />
      </div>

      {/* Content Area */}
      <div className="space-y-2">
        <h3 className="text-lg font-semibold tracking-tight text-white">
          {title}
        </h3>
        {description && (
          <p className="text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  );
};