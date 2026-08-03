import React from 'react';

interface CompletionRateCardProps {
  /** Completion percentage value between 0 and 100 */
  percentage?: number;
  /** Custom title for the card */
  title?: string;
}

export const CompletionRateCard: React.FC<CompletionRateCardProps> = ({
  percentage = 0,
  title = 'Completion rate',
}) => {
  // Ensure the percentage stays within 0 - 100 bounds
  const clampedPercentage = Math.min(100, Math.max(0, percentage));

  return (
    <div className="w-full max-w-7xl rounded-2xl  border border-[#1e232d] p-5 shadow-sm">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-white tracking-tight">
          {title}
        </h3>
        <span className="text-sm font-medium text-slate-400">
          {clampedPercentage}%
        </span>
      </div>

      {/* Progress Bar Container */}
      <div className="w-full h-2.5 bg-primary rounded-full overflow-hidden">
        {/* Fill Line */}
        <div
          className="h-full bg-amber-500/80 rounded-full transition-all duration-300 ease-out"
          style={{ width: `${clampedPercentage}%` }}
        />
      </div>
    </div>
  );
};

export default CompletionRateCard;