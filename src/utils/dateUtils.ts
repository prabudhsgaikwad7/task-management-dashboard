import { format, parseISO, isToday, isTomorrow, isYesterday, formatDistanceToNow } from 'date-fns';

export const formatDateDisplay = (dateString: string): string => {
  if (!dateString) return '';
  try {
    const date = parseISO(dateString);
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    if (isYesterday(date)) return 'Yesterday';
    return format(date, 'MMM d, yyyy');
  } catch {
    return dateString;
  }
};

export const formatRelativeTime = (isoString: string): string => {
  if (!isoString) return '';
  try {
    const date = parseISO(isoString);
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return isoString;
  }
};

export const getDueDateBadgeStyle = (dueDateStr: string, status: string): { text: string; colorClass: string; isUrgent: boolean } => {
  if (status === 'Completed') {
    return {
      text: formatDateDisplay(dueDateStr),
      colorClass: 'text-slate-500 bg-slate-100 dark:bg-slate-800 dark:text-slate-400',
      isUrgent: false,
    };
  }

  const todayStr = new Date().toISOString().split('T')[0];

  if (dueDateStr < todayStr) {
    return {
      text: `Overdue (${formatDateDisplay(dueDateStr)})`,
      colorClass: 'text-rose-700 bg-rose-50 border border-rose-200 font-medium',
      isUrgent: true,
    };
  }

  if (dueDateStr === todayStr) {
    return {
      text: 'Due Today',
      colorClass: 'text-amber-700 bg-amber-50 border border-amber-200 font-medium',
      isUrgent: true,
    };
  }

  return {
    text: formatDateDisplay(dueDateStr),
    colorClass: 'text-slate-600 bg-slate-100 border border-slate-200',
    isUrgent: false,
  };
};
