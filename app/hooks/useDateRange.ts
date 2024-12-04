'use client';

import { useState, useCallback } from 'react';

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export function useDateRange(initialRange?: Partial<DateRange>) {
  const [dateRange, setDateRange] = useState<DateRange>({
    startDate: initialRange?.startDate || new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: initialRange?.endDate || new Date()
  });

  const updateDateRange = useCallback((newRange: Partial<DateRange>) => {
    setDateRange(prev => ({
      ...prev,
      ...newRange,
      // Ensure end date is not before start date
      endDate: newRange.endDate && newRange.endDate < prev.startDate ? prev.startDate : (newRange.endDate || prev.endDate)
    }));
  }, []);

  return {
    dateRange,
    updateDateRange
  };
}