import { getDashboardData } from "@/lib/getDashboardData"
import { DashboardPeriodSelect } from "../components/Dashboard/DashboardPeriodSelect";
import { Calendar } from "lucide-react";
import { KPICard } from "../components/Dashboard/KPICard";
import { PieChart } from "../components/Dashboard/PieChart";
import { LineChart } from "../components/Dashboard/LineChart";
import { DonutChart } from "../components/Dashboard/DonutChart";
import { BarChartStacked } from "../components/Dashboard/BarChartStacked";
import { BarChart } from "../components/Dashboard/BarChart";

export default async function DashboardPage() {
	const data = await getDashboardData({ period: "monthly" });

	if (!data) {
		return <div className="text-center text-red-500">Failed to load dashboard data</div>;
	}

	return (
		<div className="flex flex-col items-center px-4 py-6 gap-4">
			<DashboardPeriodSelect/> {/* OK */}
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
