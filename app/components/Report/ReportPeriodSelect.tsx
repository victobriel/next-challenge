'use client';

import { Period } from '@/lib/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';
import { getReportPeriod, setReportPeriod } from '@/redux/report-period/slice';

export const ReportPeriodSelect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const reportPeriod = useSelector(getReportPeriod);

  const periods: Period[] = ['monthly', 'quarterly', 'yearly'];

  const handlePeriodChange = (value: Period) => {
    dispatch(setReportPeriod(value));
  };

  return (
    <Select value={reportPeriod} onValueChange={handlePeriodChange}>
      <SelectTrigger>
        <SelectValue placeholder='Select Period' />
      </SelectTrigger>
      <SelectContent>
        {periods.map((period) => (
          <SelectItem key={period} value={period}>
            {period.charAt(0).toUpperCase() + period.slice(1)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
