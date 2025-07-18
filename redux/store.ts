import { configureStore } from "@reduxjs/toolkit";
import { dashboardPeriodReducer } from "./dashboard-period/slice";

export const store = configureStore({
	reducer: {
		dashboardPeriod: dashboardPeriodReducer,
		//
	},
});
