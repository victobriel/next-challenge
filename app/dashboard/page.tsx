'use client';

import { DashboardPeriodSelect } from "../components/Dashboard/DashboardPeriodSelect";
import { Calendar } from "lucide-react";
import { KPICard } from "../components/Dashboard/KPICard";
import { PieChart } from "../components/Dashboard/PieChart";
import { LineChart } from "../components/Dashboard/LineChart";
import { DonutChart } from "../components/Dashboard/DonutChart";
import { BarChartStacked } from "../components/Dashboard/BarChartStacked";
import { BarChart } from "../components/Dashboard/BarChart";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardData, getDashboardData, getDashboardError, getDashboardLoading, getDashboardPeriod } from "@/redux/dashboard-period/slice";
import { useEffect } from "react";
import { AppDispatch } from "@/redux/store";

export default function DashboardPage() {
	const dispatch = useDispatch<AppDispatch>();
	const data = useSelector(getDashboardData);
	const loading = useSelector(getDashboardLoading);
	const error = useSelector(getDashboardError);
	const period = useSelector(getDashboardPeriod);

	useEffect(() => {
		if (!data) {
			dispatch(fetchDashboardData(period));
		}
	}, [dispatch, period, data]);

	if (loading) {
		return (
			<div className="flex flex-col items-center px-4 py-6 gap-4">
				<DashboardPeriodSelect />
				<div className="flex items-center justify-center h-64">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="flex flex-col items-center px-4 py-6 gap-4">
				<DashboardPeriodSelect />
				<div className="text-center">
					<p className="text-red-600 mb-2">Error loading dashboard data:</p>
					<p className="text-sm text-gray-600">{error}</p>
					<button 
						onClick={() => dispatch(fetchDashboardData(period))}
						className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!data || Object.keys(data).length === 0) {
		return (
			<div className="flex flex-col items-center px-4 py-6 gap-4">
				<DashboardPeriodSelect/> {/* OK */}
				No data
			</div>
		);
	}

	return (
		<div className="flex flex-col items-center px-4 py-6 gap-4">
			<DashboardPeriodSelect /> {/* OK */}
			<h1 className="text-3xl font-bold text-center">Financial Overview</h1>
			<div className="w-full space-y-4">
				<div className="space-y-2 mb-4 flex flex-col items-center">
					<p className="text-sm text-center">Period: {data?.mainDashboard.startDate} - {data?.mainDashboard.endDate}</p>
					<div className="flex items-center gap-2 text-sm">
						<Calendar className="size-4"/>
						<span>Last updated: {data?.mainDashboard.metricDate}</span>
					</div>
				</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
					{data.mainDashboardKPIs.topKPIs.map((kpi) => (
						<KPICard key={kpi.name} kpi={kpi} isTopKpi /> 
					))}
				</div>
				<div className="grid grid-cols-1 gap-4">
					{/* Cash At Bank */} {/* OK */}
					<div className="w-full h-96 p-4 rounded-lg shadow-sm border">
						<h2 className="text-lg font-bold mb-4">Cash at Bank Over Time</h2>
						<LineChart data={data.mainDashboard.charts.cashAtBank} dateArray={data.mainDashboard.dateArray} />
					</div>
					{/* Expense Split */} {/* OK */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h3 className="text-lg font-bold text-gray-900 mb-4">Expense Split</h3>
						<DonutChart data={data.mainDashboard.charts.expenseSplit} />
					</div>
					{/* Indirect Cashflow */} {/* OK */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h3 className="text-lg font-bold text-gray-900 mb-4">Expense Split</h3>
						<BarChart data={data.mainDashboard.charts.indirectCashflow} dateArray={data.mainDashboard.dateArray} />
					</div>
					{/* Revenue Split */} {/* OK */}
					<div className="bg-white rounded-lg shadow-sm border p-6">
						<h3 className="text-lg font-bold text-gray-900 mb-4">Revenue Sources</h3>
						<PieChart data={data.mainDashboard.charts.totalRevenuesSplit} />
					</div>
					{/* Profit Loss Overview */} {/* OK */}
					<div className="w-full h-96 p-4 rounded-lg shadow-sm border">
						<h3 className="text-lg font-bold text-gray-900 mb-4">Profit Loss Overview</h3>
						<BarChartStacked data={data.mainDashboard.charts.profitLossOverview} dateArray={data.mainDashboard.dateArray} />
					</div>
        </div>
			</div>
		</div>
	)
}
