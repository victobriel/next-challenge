'use client';

import React, { useMemo, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { ChevronDown, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { getReportPeriod } from '@/redux/report-period/slice';
import { FinanceMovement } from '@/lib/types';
import { createDataStrategy } from '@/lib/report/utils/data-strategies';
import {
  getBgColor,
  getTextColor,
  getTypeLabel,
} from '@/lib/report/utils/report-utils';

interface ReportTableProps {
  report: {
    profitnLoss: FinanceMovement[];
  };
}

interface ExpandedState {
  [key: string]: boolean;
}

interface VisibilityState {
  [key: string]: boolean;
}

export function ReportTable({ report }: ReportTableProps) {
  const [expandedItems, setExpandedItems] = useState<ExpandedState>({});
  const period = useSelector(getReportPeriod);

  // State for field visibility
  const [fieldVisibility, setFieldVisibility] = useState<VisibilityState>(
    () => {
      // Initialize all fields as visible
      const initialState: VisibilityState = {};
      report.profitnLoss.forEach((item) => {
        item.fields?.forEach((field) => {
          initialState[`${item.id}-${field.name}`] = true;
        });
      });
      return initialState;
    }
  );

  // State for show/hide all toggle
  const [showAllDetails, setShowAllDetails] = useState(false);

  const { strategy, tableLabels } = useMemo(() => {
    const dataStrategy = createDataStrategy(period);
    return {
      strategy: dataStrategy,
      tableLabels: dataStrategy.getLabels(),
    };
  }, [period]);

  // Toggle expansion for a specific item
  const toggleExpanded = useCallback((itemId: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  }, []);

  // Toggle field visibility
  const toggleFieldVisibility = useCallback((fieldKey: string) => {
    setFieldVisibility((prev) => ({
      ...prev,
      [fieldKey]: !prev[fieldKey],
    }));
  }, []);

  // Toggle all items expanded/collapsed
  const toggleAllExpanded = useCallback(() => {
    const newState = !showAllDetails;
    setShowAllDetails(newState);

    const newExpandedState: ExpandedState = {};
    report.profitnLoss.forEach((item) => {
      newExpandedState[item.id] = newState;
    });
    setExpandedItems(newExpandedState);
  }, [showAllDetails, report.profitnLoss]);

  // Calculate totals for each category
  const calculateCategoryTotal = useCallback(
    (item: FinanceMovement, labelIndex: number) => {
      const visibleFields =
        item.fields?.filter(
          (field) => fieldVisibility[`${item.id}-${field.name}`] !== false
        ) || [];

      return visibleFields.reduce((total, field) => {
        const data = strategy.getData({ ...item, fields: [field] });
        return total + (data[labelIndex] || 0);
      }, 0);
    },
    [strategy, fieldVisibility]
  );

  const renderTableHeader = () => (
    <thead className='bg-muted/50'>
      <tr>
        <th className='text-muted-foreground px-4 py-4 text-left text-xs font-medium tracking-wider uppercase'>
          <div className='flex items-center gap-2'>
            Category
            <button
              onClick={toggleAllExpanded}
              className='bg-muted hover:bg-muted/80 flex items-center gap-1 rounded px-2 py-1 text-xs transition-colors'
              title={showAllDetails ? 'Collapse All' : 'Expand All'}
            >
              {showAllDetails ? (
                <EyeOff className='h-3 w-3' />
              ) : (
                <Eye className='h-3 w-3' />
              )}
              {showAllDetails ? 'Hide' : 'Show'} Details
            </button>
          </div>
        </th>
        <th className='text-muted-foreground min-w-28 px-4 py-4 text-center text-xs font-medium tracking-wider uppercase'>
          Type
        </th>
        {tableLabels.map((label) => (
          <th
            key={label}
            className='text-muted-foreground px-4 py-4 text-center text-xs font-medium tracking-wider uppercase'
          >
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );

  const renderCategorySummary = (item: FinanceMovement) => {
    const isExpanded = expandedItems[item.id];
    const bgColor = getBgColor(item.type);
    const textColor = getTextColor(item.type);
    const typeLabel = getTypeLabel(item.type);
    const hasFields = item.fields && item.fields.length > 0;

    return (
      <tr key={`${item.id}-summary`} className='bg-muted/20 border-b'>
        <td className='px-4 py-3'>
          <div className='flex items-center gap-2'>
            {hasFields && (
              <button
                onClick={() => toggleExpanded(item.id)}
                className='hover:bg-muted/50 rounded p-1 transition-colors'
                title={isExpanded ? 'Collapse' : 'Expand'}
              >
                {isExpanded ? (
                  <ChevronDown className='h-4 w-4' />
                ) : (
                  <ChevronRight className='h-4 w-4' />
                )}
              </button>
            )}
            <span className='text-foreground text-lg font-bold'>
              {item.name}
            </span>
            {hasFields && (
              <span className='text-muted-foreground bg-muted rounded px-2 py-1 text-xs'>
                {item.fields.length} items
              </span>
            )}
          </div>
        </td>

        <td className='px-4 py-3 text-center'>
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${textColor} ${bgColor} w-full justify-center`}
          >
            {typeLabel}
          </span>
        </td>

        {tableLabels.map((label, labelIndex) => (
          <td key={label} className='px-4 py-3 text-center'>
            <span className={`font-bold ${textColor}`}>
              {formatCurrency(calculateCategoryTotal(item, labelIndex))}
            </span>
          </td>
        ))}
      </tr>
    );
  };

  const renderFieldRows = (item: FinanceMovement) => {
    const isExpanded = expandedItems[item.id];
    if (!isExpanded || !item.fields) return null;

    return item.fields.map((field, fieldIndex) => {
      const fieldKey = `${item.id}-${field.name}`;
      const isVisible = fieldVisibility[fieldKey] !== false;
      const data = strategy.getData({ ...item, fields: [field] });
      const textColor = getTextColor(item.type);
      const bgColor = getBgColor(item.type);

      return (
        <tr
          key={fieldKey}
          className={`border-l-muted border-l-4 ${isVisible ? 'bg-background' : 'bg-muted/10 opacity-60'} hover:bg-muted/30 transition-colors`}
        >
          <td className='px-4 py-2 pl-12'>
            <div className='flex items-center gap-2'>
              <button
                onClick={() => toggleFieldVisibility(fieldKey)}
                className='hover:bg-muted/50 rounded p-1 transition-colors'
                title={isVisible ? 'Hide field' : 'Show field'}
              >
                {isVisible ? (
                  <Eye className='h-3 w-3 text-green-600' />
                ) : (
                  <EyeOff className='text-muted-foreground h-3 w-3' />
                )}
              </button>
              <span
                className={`text-sm ${isVisible ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
              >
                {field.name}
              </span>
            </div>
          </td>

          <td className='px-4 py-2 text-center'>
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${textColor} ${bgColor} w-full justify-center`}
            >
              {getTypeLabel(item.type) || 'N/A'}
            </span>
          </td>

          {tableLabels.map((label, labelIndex) => (
            <td key={label} className='px-4 py-2 text-center'>
              <span
                className={`text-sm font-medium ${isVisible ? '' : 'text-muted-foreground'}`}
              >
                {isVisible ? formatCurrency(data[labelIndex]) || '-' : '---'}
              </span>
            </td>
          ))}
        </tr>
      );
    });
  };

  // Statistics for the footer
  const totalCategories = report.profitnLoss.length;
  const expandedCategories =
    Object.values(expandedItems).filter(Boolean).length;
  const totalFields = report.profitnLoss.reduce(
    (sum, item) => sum + (item.fields?.length || 0),
    0
  );
  const visibleFields = Object.values(fieldVisibility).filter(Boolean).length;

  return (
    <div className='w-full space-y-4'>
      <div className='bg-muted/50 text-muted-foreground flex items-center justify-between rounded-lg p-4 text-xs'>
        <div className='flex gap-6'>
          <span>Categories: {totalCategories}</span>
          <span>Expanded: {expandedCategories}</span>
          <span>
            Fields: {visibleFields}/{totalFields}
          </span>
        </div>
        <div className='text-xs'>
          Click categories to expand • Toggle field visibility with eye icons
        </div>
      </div>

      {/* Table */}
      <div className='w-full overflow-x-auto'>
        <div className='inline-block min-w-full align-middle'>
          <div className='overflow-hidden border md:rounded-lg'>
            <table className='report-table min-w-full border-collapse'>
              {renderTableHeader()}
              <tbody>
                {report.profitnLoss.map((item) => (
                  <React.Fragment key={item.id}>
                    {renderCategorySummary(item)}
                    {renderFieldRows(item)}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className='bg-muted/50 flex flex-wrap gap-6 rounded-lg p-4 text-xs'>
        <div className='flex items-center gap-2'>
          <ChevronRight className='h-3 w-3' />
          <span>Collapsed category</span>
        </div>
        <div className='flex items-center gap-2'>
          <ChevronDown className='h-3 w-3' />
          <span>Expanded category</span>
        </div>
        <div className='flex items-center gap-2'>
          <Eye className='h-3 w-3 text-green-600' />
          <span>Visible field</span>
        </div>
        <div className='flex items-center gap-2'>
          <EyeOff className='text-muted-foreground h-3 w-3' />
          <span>Hidden field</span>
        </div>
      </div>
    </div>
  );
}
