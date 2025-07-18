import { KPI, TopKPI } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { TrendingDown, TrendingUp } from "lucide-react";

type KPICardProps = KPICardTop | KPICardRegular;

interface KPICardTop {
	kpi: TopKPI;
	isTopKpi: true;
}

interface KPICardRegular {
	kpi: KPI;
	isTopKpi?: false;
}

export const KPICard = ({ kpi, isTopKpi }: KPICardProps) => {
	const isPositive = isTopKpi ? Number(kpi.mOm || 0) >= 0 : Number(kpi.mom || 0) >= 0;
	const percentage = isTopKpi ? Number(kpi.mOm) : Number(kpi.mom);

	return (
		<div className={'bg-white rounded-lg shadow-sm border px-6 py-4 space-y-2'}>
			<p className="text-sm font-medium text-gray-600">{kpi.name}</p>
			<p className="text-4xl text-kdwa-foreground text-center">{formatCurrency(kpi.value)}</p>
			{percentage !== undefined && !isNaN(percentage) ? (
				<div className="flex items-center mt-1 justify-center">
					{isPositive ? (
						<TrendingUp className="w-4 h-4 text-green-500 mr-1" />
					) : (
						<TrendingDown className="w-4 h-4 text-red-500 mr-1" />
					)}
					<span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
						{Math.abs(percentage).toFixed(1)}%
					</span>
				</div>
			) : (
				<p className="text-sm text-gray-500">No data</p>
			)}
		</div>
	)
}
