import React from 'react';
import type { SummaryStats } from '../../types';
import { CheckCircle2, Clock, AlertTriangle, Layers, ArrowUpRight } from 'lucide-react';
import { SummaryCardSkeleton } from '../ui/Skeleton';

interface SummaryCardsProps {
  stats: SummaryStats | null;
  isLoading: boolean;
  activeStatusFilter: string;
  onSelectStatus: (status: string) => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  stats,
  isLoading,
  activeStatusFilter,
  onSelectStatus,
}) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
        <SummaryCardSkeleton />
      </div>
    );
  }

  const cards = [
    {
      id: 'all',
      title: 'Total Tasks',
      count: stats.total,
      subtitle: `${stats.inProgress} active in progress`,
      icon: <Layers className="w-5 h-5 text-brand-600" />,
      iconBg: 'bg-brand-50 text-brand-600 border-brand-100',
      activeBorder: 'border-brand-500 ring-2 ring-brand-500/20 bg-brand-50/20',
      accentColor: 'text-brand-700',
      progress: 100,
      progressColor: 'bg-brand-500',
    },
    {
      id: 'Pending',
      title: 'Pending Tasks',
      count: stats.pending,
      subtitle: `${stats.urgentPending} high priority/urgent`,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50 text-amber-600 border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20',
      accentColor: 'text-amber-700',
      progress: stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0,
      progressColor: 'bg-amber-500',
    },
    {
      id: 'Completed',
      title: 'Completed Tasks',
      count: stats.completed,
      subtitle: `${stats.completionRate}% completion rate`,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20',
      accentColor: 'text-emerald-700',
      progress: stats.completionRate,
      progressColor: 'bg-emerald-500',
    },
    {
      id: 'Overdue',
      title: 'Overdue Tasks',
      count: stats.overdue,
      subtitle: stats.overdue > 0 ? 'Requires immediate action' : 'All up to date!',
      icon: <AlertTriangle className="w-5 h-5 text-rose-600" />,
      iconBg: 'bg-rose-50 text-rose-600 border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/20',
      accentColor: 'text-rose-700',
      progress: stats.total > 0 ? Math.round((stats.overdue / stats.total) * 100) : 0,
      progressColor: 'bg-rose-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const isSelected = activeStatusFilter === card.id;

        return (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectStatus(card.id)}
            className={`flex flex-col justify-between text-left p-5 rounded-2xl bg-white border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 group relative overflow-hidden ${
              isSelected ? card.activeBorder : 'border-slate-200/90 shadow-xs hover:border-slate-300'
            }`}
          >
            {/* Top Row: Label & Icon */}
            <div className="flex items-center justify-between w-full mb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>
              <div
                className={`p-2 rounded-xl border transition-transform group-hover:scale-110 ${card.iconBg}`}
              >
                {card.icon}
              </div>
            </div>

            {/* Middle Row: Big Number & Action Hint */}
            <div className="flex items-baseline justify-between w-full mb-2">
              <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {card.count}
              </div>
              <div className="text-[11px] font-medium text-slate-400 group-hover:text-brand-600 flex items-center gap-0.5 transition-colors">
                <span>Filter</span>
                <ArrowUpRight className="w-3 h-3" />
              </div>
            </div>

            {/* Bottom Row: Subtitle & Mini Progress Bar */}
            <div className="w-full mt-2">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5 font-medium">
                <span className="truncate">{card.subtitle}</span>
                {card.id !== 'all' && <span>{card.progress}%</span>}
              </div>
              <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${card.progressColor}`}
                  style={{ width: `${Math.max(card.progress, 4)}%` }}
                />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
};
