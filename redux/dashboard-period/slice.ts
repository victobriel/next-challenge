import { DashboardPeriod } from "@/lib/types";
import { createSlice } from "@reduxjs/toolkit";

interface DashboardPeriodState {
	period: DashboardPeriod;
}

const initialState: DashboardPeriodState = {
	period: "monthly",
}

export const slice = createSlice({
	name: "dashboardPeriod",
	initialState,
	reducers: {
		setDashboardPeriod: (state, action) => {
			state.period = action.payload;
		}
	}
})

export const { setDashboardPeriod } = slice.actions;

export const getDashboardPeriod = (state: { dashboardPeriod: DashboardPeriodState }) => state.dashboardPeriod.period;

export const dashboardPeriodReducer = slice.reducer;
