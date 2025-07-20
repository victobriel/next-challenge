import { Period, ReportData } from '@/lib/types';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

interface ReportPeriodState {
  period: Period;
  data: ReportData | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReportPeriodState = {
  period: 'monthly',
  data: null,
  loading: false,
  error: null,
};

export const fetchReportData = createAsyncThunk(
  'report/fetchReportData',
  async () => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    try {
      const response = await fetch(`${baseUrl}/api/report`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Failed to fetch report data:', error);
    }
  }
);

export const slice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    setReportPeriod: (state, action) => {
      state.period = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReportData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchReportData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setReportPeriod, clearError } = slice.actions;

export const getReportPeriod = (state: { report: ReportPeriodState }) =>
  state.report.period;
export const getReportData = (state: { report: ReportPeriodState }) =>
  state.report.data;
export const getReportLoading = (state: { report: ReportPeriodState }) =>
  state.report.loading;
export const getReportError = (state: { report: ReportPeriodState }) =>
  state.report.error;

export const reportPeriodReducer = slice.reducer;
