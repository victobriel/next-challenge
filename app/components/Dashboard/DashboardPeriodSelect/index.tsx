'use client';

import { DashboardPeriod } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select"
import { useDispatch, useSelector } from "react-redux";
import { getDashboardPeriod, setDashboardPeriod } from "@/redux/dashboard-period/slice";

export const DashboardPeriodSelect = () => {
	const dispatch = useDispatch();
	const dashboardPeriod = useSelector(getDashboardPeriod)

	const periods: DashboardPeriod[] = ["monthly", "quarterly", "yearly"];

	return (
		<Select value={dashboardPeriod} onValueChange={(value) => { dispatch(setDashboardPeriod(value)) }}>
			<SelectTrigger>
				<SelectValue placeholder="Select Period" />
			</SelectTrigger>
			<SelectContent>
				{periods.map((period) => (
					<SelectItem key={period} value={period}>
						{period.charAt(0).toUpperCase() + period.slice(1)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
