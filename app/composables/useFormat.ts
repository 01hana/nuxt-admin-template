import { format } from 'date-fns';

export function useFormat() {
  function formatDate(dateValue: string, type?: string) {
    if (type === 'date') return format(new Date(dateValue), 'yyyy-MM-dd');

    return format(new Date(dateValue), 'yyyy-MM-dd HH:mm:ss');
  }

  return {
    formatDate,
  };
}
