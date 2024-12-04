'use client';

import { useState, useCallback } from 'react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';

interface TimeFrameSelectorProps {
  onTimeFrameChange: (startDate: Date, endDate: Date) => void;
}

export default function TimeFrameSelector({ onTimeFrameChange }: TimeFrameSelectorProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    endDate: new Date()
  });
  const [isStartPickerOpen, setIsStartPickerOpen] = useState(false);
  const [isEndPickerOpen, setIsEndPickerOpen] = useState(false);

  const handleDateChange = useCallback((type: 'start' | 'end', date: Date | null) => {
    if (!date) return;

    setDateRange(prev => {
      let newRange = type === 'start' 
        ? { startDate: date, endDate: prev.endDate }
        : { startDate: prev.startDate, endDate: date };

      // Ensure end date is not before start date
      if (newRange.endDate < newRange.startDate) {
        newRange = type === 'start'
          ? { startDate: date, endDate: date }
          : { startDate: date, endDate: date };
      }

      // Ensure end date is not in the future
      if (newRange.endDate > new Date()) {
        newRange.endDate = new Date();
      }

      onTimeFrameChange(newRange.startDate, newRange.endDate);
      return newRange;
    });

    if (type === 'start') {
      setIsStartPickerOpen(false);
      setIsEndPickerOpen(true);
    } else {
      setIsEndPickerOpen(false);
    }
  }, [onTimeFrameChange]);

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center gap-2 bg-white dark:bg-black rounded-md p-1.5 border border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="relative">
          <DatePicker
            selected={dateRange.startDate}
            onChange={(date) => handleDateChange('start', date)}
            selectsStart
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            dateFormat="MMM d"
            placeholderText="Start"
            open={isStartPickerOpen}
            onInputClick={() => setIsStartPickerOpen(true)}
            onClickOutside={() => setIsStartPickerOpen(false)}
            className="w-20 px-2 py-1.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors cursor-pointer"
          />
        </div>
        <span className="text-gray-400">→</span>
        <div className="relative">
          <DatePicker
            selected={dateRange.endDate}
            onChange={(date) => handleDateChange('end', date)}
            selectsEnd
            startDate={dateRange.startDate}
            endDate={dateRange.endDate}
            minDate={dateRange.startDate}
            maxDate={new Date()}
            dateFormat="MMM d"
            placeholderText="End"
            open={isEndPickerOpen}
            onInputClick={() => setIsEndPickerOpen(true)}
            onClickOutside={() => setIsEndPickerOpen(false)}
            className="w-20 px-2 py-1.5 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-md text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-black dark:focus:ring-white focus:border-transparent transition-colors cursor-pointer"
          />
        </div>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        {`${format(dateRange.startDate, 'MMM d, yyyy')} - ${format(dateRange.endDate, 'MMM d, yyyy')}`}
      </div>
    </div>
  );
}