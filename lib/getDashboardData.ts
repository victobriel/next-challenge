import { DashboardData, DashboardPeriod } from "./types";

interface GetDashboardDataParams {
	period: DashboardPeriod;
}

export const getDashboardData = async ({ period }: GetDashboardDataParams): Promise<DashboardData | null>  => {
	const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

	try {
		const response = await fetch(`${baseUrl}/api/main-dashboard?period=${period}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
		});

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}

		const data = await response.json();
		return data;

	} catch (error) {
		console.error("Failed to fetch dashboard data:", error);
		return null;
	}
}
