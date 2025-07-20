import { configureStore } from "@reduxjs/toolkit";
import { dashboardPeriodReducer } from "./dashboard-period/slice";
import { reportPeriodReducer } from "./report-period/slice";

export const store = configureStore({
	reducer: {
		dashboardPeriod: dashboardPeriodReducer,
		report: reportPeriodReducer,
		//
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
