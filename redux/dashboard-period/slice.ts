import { DashboardData, Period } from "@/lib/types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface DashboardPeriodState {
	period: Period;
	data: DashboardData | null;
	loading: boolean;
	error: string | null;
}

const initialState: DashboardPeriodState = {
	period: "monthly",
	data: null,
	loading: false,
	error: null,
}

export const fetchDashboardData = createAsyncThunk(
	'dashboardPeriod/fetchDashboardData',
	async (period: Period, { rejectWithValue }) => {
		const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

		try {
			const response = await fetch(`${baseUrl}/api/main-dashboard?period=${period}`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error("Failed to fetch dashboard data:", error);
			return rejectWithValue(error instanceof Error ? error.message : 'An unknown error occurred');
		}
	}
);

export const slice = createSlice({
	name: "dashboardPeriod",
	initialState,
	reducers: {
		setDashboardPeriod: (state, action) => {
			state.period = action.payload;
		},
		clearError: (state) => {
			state.error = null;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchDashboardData.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchDashboardData.fulfilled, (state, action) => {
				state.loading = false;
				state.data = action.payload;
				state.error = null;
			})
			.addCase(fetchDashboardData.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload as string;
			});
	},
})

export const { setDashboardPeriod, clearError } = slice.actions;

export const getDashboardPeriod = (state: { dashboardPeriod: DashboardPeriodState }) => state.dashboardPeriod.period;
export const getDashboardData = (state: { dashboardPeriod: DashboardPeriodState }) => state.dashboardPeriod.data;
export const getDashboardLoading = (state: { dashboardPeriod: DashboardPeriodState }) => state.dashboardPeriod.loading;
export const getDashboardError = (state: { dashboardPeriod: DashboardPeriodState }) => state.dashboardPeriod.error;

export const dashboardPeriodReducer = slice.reducer;
