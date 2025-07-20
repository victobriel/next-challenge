'use client';

import { Suspense, useEffect } from 'react';
import { ReportPeriodSelect } from '../components/Report/ReportPeriodSelect';
import { ReportSummaryCards } from '../components/Report/ReportSummaryCards';
import { ReportTable } from '../components/Report/ReportTable';
import { ErrorDisplay } from '../components/Report/ErrorDisplay';
import {
  fetchReportData,
  getReportData,
  getReportError,
  getReportLoading,
} from '@/redux/report-period/slice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '@/redux/store';

export default function ReportPage() {
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(getReportData);
  const loading = useSelector(getReportLoading);
  const error = useSelector(getReportError);

  useEffect(() => {
    if (!data) {
      dispatch(fetchReportData());
    }
  }, [dispatch, data]);

  if (loading) {
    return (
      <div className='flex flex-col items-center gap-4 px-4 py-6'>
        <div className='flex h-64 items-center justify-center'>
          <div className='h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600'></div>
        </div>
      </div>
    );
  }

  if (error)
    return (
      <ErrorDisplay error={error} onRetry={() => dispatch(fetchReportData())} />
    );

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className='flex flex-col items-center gap-4 px-4 py-6'>
        <p className='text-muted-foreground'>No report data available</p>
      </div>
    );
  }

  const { reportResult: report } = data;

  return (
    <Suspense fallback={<>Loading...</>}>
      <div className='mb-8 space-y-4 p-6'>
        <div className='flex flex-wrap items-center justify-between'>
          <div>
            <h1 className='text-foreground text-4xl font-bold'>
              Financial Report
            </h1>
            <p className='text-muted-foreground'>{`${report.startingDate} - ${report.endingDate}`}</p>
          </div>
          <ReportPeriodSelect />
        </div>

        <ReportSummaryCards report={report} />
        <ReportTable report={report} />
      </div>
    </Suspense>
  );
}
