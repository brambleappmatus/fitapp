'use client';

import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onDateChange: (start: Date, end: Date) => void;
}

export default function DateRangePicker({ startDate, endDate, onDateChange }: DateRangePickerProps) {
  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <DatePicker
          selected={startDate}
          onChange={(date) => date && onDateChange(date, endDate)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          maxDate={endDate}
          dateFormat="MMM d, yyyy"
          className="w-40 px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          placeholderText="Start Date"
        />
      </div>
      <span className="text-gray-400">→</span>
      <div className="relative">
        <DatePicker
          selected={endDate}
          onChange={(date) => date && onDateChange(startDate, date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          maxDate={new Date()}
          dateFormat="MMM d, yyyy"
          className="w-40 px-3 py-2 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded-lg text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          placeholderText="End Date"
        />
      </div>
    </div>
  );
}