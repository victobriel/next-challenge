/* eslint-disable @typescript-eslint/no-explicit-any */
import { LucideIcon } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

export type Period = 'monthly' | 'quarterly' | 'yearly';
type ChartType = 'line' | 'donut' | 'bar' | 'pie' | 'columnStacked';

export interface DashboardData {
  mainDashboard: {
    period: Period;
    startDate: string;
    endDate: string;
    metricDate: string;
    dateArray: string[];
    charts: {
      cashAtBank: ChartData[];
      expenseSplit: ChartData[];
      indirectCashflow: (ChartData | null)[];
      totalRevenuesSplit: ChartData[];
      profitLossOverview: ChartData[];
      salariesSplit: ChartData[];
      ManpowerOperatingExpenses: ChartData[];
    };
  };
  mainDashboardKPIs: {
    topKPIs: TopKPI[];
    KPIs: KPI[];
  };
}

export interface ChartData {
  chartType: ChartType;
  name: string;
  values: number[] | number;
}

export interface TopKPI {
  name: string;
  value: number;
  date?: string;
  mOm?: number;
  type?: string;
}

export interface KPI {
  name: string;
  value: number;
  mom: string;
  prefix: string;
}

export interface ReportData {
  reportResult: {
    id: number;
    scenarioId: number;
    startingDate: string;
    endingDate: string;
    createdAt: Date;
    updatedAt: Date;
    profitnLoss: FinanceMovement[];
    metrics: {
      pnlKeyMetrics: FinanceMovement;
    };
    computedFields: {
      result: number[];
      pastMonth: number[];
      yearly: number[];
      quarterly: number[];
      yearlyPastMonth: number[];
      quarterlyPastMonth: number[];
      currentYearActual: number[];
      currentQuarterActual: number[];
      name: string;
      totalResult: number[];
    }[];
  };
}

interface ReportField {
  id: number;
  topLevelFieldId: number;
  name: string;
  code: string | null;
  uniqueReference: {
    sheetType: string;
    integrationSourceId: number;
    sourceType: string;
    accountId: string | null;
    accountName: string | null;
    metric: boolean;
  };
  order: number | null;
  description: string | null;
  style: string | null;
  fieldType: string | null;
  createdAt: Date;
  updatedAt: Date;
  fieldId: number | null;
  outputs: any[];
  actualData: ReportActualData[];
  fields?: ReportField[];
  result: number[];
  totalResult: number[];
  pastMonth: number[];
  yearly: number[];
  quarterly: number[];
  yearlyPastMonth: number[];
  quarterlyPastMonth: number[];
  yearlyResult: number[];
  quarterlyResult: number[];
}

interface ReportActualData {
  id: number;
  topLevelFieldId: number | null;
  fieldId: number;
  value: number[];
  codatAccountId: string | null;
  integrationSourceId: number | null;
  source: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinanceMovement {
  id: number;
  financialReportId: number;
  name: string;
  type: string;
  description: string | null;
  style: string | null;
  createdAt: Date;
  updatedAt: Date;
  outputs: any[];
  actualData: ReportActualData[];
  fields: ReportField[];
  result: number[];
  totalResult: number[];
  pastMonth: number[];
  yearly: number[];
  quarterly: number[];
  yearlyPastMonth: number[];
  quarterlyPastMonth: number[];
  yearlyResult: number[];
  quarterlyResult: number[];
}
