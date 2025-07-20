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
import {
  fetchDashboardData,
  getDashboardPeriod,
  setDashboardPeriod,
} from '@/redux/dashboard-period/slice';
import { AppDispatch } from '@/redux/store';

export const DashboardPeriodSelect = () => {
  const dispatch = useDispatch<AppDispatch>();
  const dashboardPeriod = useSelector(getDashboardPeriod);

  const periods: Period[] = ['monthly', 'quarterly', 'yearly'];

  const handlePeriodChange = (value: Period) => {
    dispatch(setDashboardPeriod(value));
    dispatch(fetchDashboardData(value));
  };

  return (
    <Select value={dashboardPeriod} onValueChange={handlePeriodChange}>
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
