'use client';

import { Calendar } from 'lucide-react';
import { KPICard } from '../components/Dashboard/KPICard';
import { PieChart } from '../components/Dashboard/PieChart';
import { LineChart } from '../components/Dashboard/LineChart';
import { DonutChart } from '../components/Dashboard/DonutChart';
import { BarChartStacked } from '../components/Dashboard/BarChartStacked';
import { BarChart } from '../components/Dashboard/BarChart';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchDashboardData,
  getDashboardData,
  getDashboardError,
  getDashboardLoading,
  getDashboardPeriod,
} from '@/redux/dashboard-period/slice';
import { useEffect, useState } from 'react';
import { AppDispatch } from '@/redux/store';
import { DashboardPeriodSelect } from '../components/Dashboard/DashboardPeriodSelect';
import { Button } from '../components/ui/button';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(getDashboardData);
  const loading = useSelector(getDashboardLoading);
  const error = useSelector(getDashboardError);
  const period = useSelector(getDashboardPeriod);

  const [isKpisExpanded, setIsKpisExpanded] = useState(false);

  useEffect(() => {
    if (!data) {
      dispatch(fetchDashboardData(period));
    }
  }, [dispatch, period, data]);

  if (loading) {
    return (
      <div className='flex flex-col items-center gap-4 px-4 py-6'>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='px-4 py-6'>
        <div className='text-center'>
          <p className='mb-2 text-red-600'>Error loading dashboard data:</p>
          <p className='text-sm text-gray-600'>{error}</p>
          <button
            onClick={() => dispatch(fetchDashboardData(period))}
            className='mt-4 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700'
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return <div className='px-4 py-6 text-gray-500'>No data</div>;
  }

  return (
    <div className='flex flex-col items-center gap-4 px-4 py-6'>
      <h1 className='bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-4xl font-bold text-transparent'>
        Kudwa Financial Dashboard
      </h1>
      <div className='w-full space-y-4'>
        <div className='mb-4 flex flex-col items-center space-y-2'>
          <div className='flex w-full items-center justify-center gap-4 text-sm'>
            <Calendar className='size-4' />
            <p className='text-center text-sm'>
              Period: {data?.mainDashboard.startDate} -{' '}
              {data?.mainDashboard.endDate}
            </p>
            <div>
              <DashboardPeriodSelect />
            </div>
          </div>
        </div>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          {data.mainDashboardKPIs.topKPIs.map((kpi) => (
            <KPICard key={kpi.name} kpi={kpi} isTopKpi />
          ))}
          {isKpisExpanded &&
            data.mainDashboardKPIs.KPIs.length > 0 &&
            data.mainDashboardKPIs.KPIs.map((kpi) => (
              <KPICard key={kpi.name} kpi={kpi} />
            ))}
          <Button
            variant={'outline'}
            className='bg-kdwa-blue text-background hover:bg-kdwa-blue/90 hover:text-background col-span-1 sm:col-span-2 lg:col-span-4'
            onClick={() => setIsKpisExpanded(!isKpisExpanded)}
          >
            {isKpisExpanded ? 'Collapse KPIs' : 'Expand KPIs'}
          </Button>
        </div>
        <div className='grid grid-cols-1 gap-4'>
          {/* Cash At Bank */} {/* OK */}
          <div className='rounded-lg border shadow-sm'>
            <h2 className='bg-kdwa-blue text-background mb-4 rounded-t-lg p-3 text-lg font-bold'>
              Cash at Bank Over Time
            </h2>
            <div className='px-6'>
              <LineChart
                data={data.mainDashboard.charts.cashAtBank}
                dateArray={data.mainDashboard.dateArray}
              />
            </div>
          </div>
          {/* Expense Split */} {/* OK */}
          <div className='rounded-lg border shadow-sm'>
            <h2 className='bg-kdwa-blue text-background mb-4 rounded-t-lg p-3 text-lg font-bold'>
              Expense Split
            </h2>
            <div className='px-6'>
              <DonutChart data={data.mainDashboard.charts.expenseSplit} />
            </div>
          </div>
          {/* Indirect Cashflow */} {/* OK */}
          <div className='rounded-lg border shadow-sm'>
            <h2 className='bg-kdwa-blue text-background mb-4 rounded-t-lg p-3 text-lg font-bold'>
              Indirect Cashflow
            </h2>
            <div className='px-6'>
              <BarChart
                data={data.mainDashboard.charts.indirectCashflow}
                dateArray={data.mainDashboard.dateArray}
              />
            </div>
          </div>
          {/* Revenue Split */} {/* OK */}
          <div className='rounded-lg border shadow-sm'>
            <h2 className='bg-kdwa-blue text-background mb-4 rounded-t-lg p-3 text-lg font-bold'>
              Revenue Split
            </h2>
            <div className='px-6'>
              <PieChart data={data.mainDashboard.charts.totalRevenuesSplit} />
            </div>
          </div>
          {/* Profit Loss Overview */} {/* OK */}
          <div className='rounded-lg border shadow-sm'>
            <h2 className='bg-kdwa-blue text-background mb-4 rounded-t-lg p-3 text-lg font-bold'>
              Revenue Split
            </h2>
            <div className='px-6'>
              <BarChartStacked
                data={data.mainDashboard.charts.profitLossOverview}
                dateArray={data.mainDashboard.dateArray}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
