import { FinanceMovement } from '@/lib/types';

export interface DataExtractionStrategy {
  getData(item: FinanceMovement): number[];
  getLabels(): string[];
  getTotalForItem(item: FinanceMovement): number;
}

const PERIOD_CONFIGURATIONS = {
  quarterly: {
    getDataField: (item: FinanceMovement) => item.quarterly || [],
    labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025'],
  },
  yearly: {
    getDataField: (item: FinanceMovement) => item.yearly || [],
    labels: ['2024', '2025'],
  },
  monthly: {
    getDataField: (item: FinanceMovement) => item.totalResult || [],
    labels: [
      'Jan 2024',
      'Feb 2024',
      'Mar 2024',
      'Apr 2024',
      'May 2024',
      'Jun 2024',
      'Jul 2024',
      'Aug 2024',
      'Sep 2024',
      'Oct 2024',
      'Nov 2024',
      'Dec 2024',
      'Jan 2025',
      'Feb 2025',
      'Mar 2025',
      'Apr 2025',
    ],
  },
} as const;

function createDataExtractionStrategy(
  config: (typeof PERIOD_CONFIGURATIONS)[keyof typeof PERIOD_CONFIGURATIONS]
): DataExtractionStrategy {
  return {
    getData: config.getDataField,
    getLabels: () => [...config.labels],
    getTotalForItem: (item: FinanceMovement) => {
      const data = config.getDataField(item);
      return data.reduce((total, value) => total + (value || 0), 0);
    },
  };
}

export function createDataStrategy(period: string): DataExtractionStrategy {
  const normalizedPeriod = period as keyof typeof PERIOD_CONFIGURATIONS;
  const config =
    PERIOD_CONFIGURATIONS[normalizedPeriod] || PERIOD_CONFIGURATIONS.monthly;
  return createDataExtractionStrategy(config);
}
