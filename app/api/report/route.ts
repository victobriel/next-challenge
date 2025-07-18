import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import { ReportData } from "@/lib/types";

export async function GET(): Promise<NextResponse<ReportData | { error: string }>> {
	try {
		const filePath = process.cwd() + "/app/api/report/data/report.json";

		const reportJson = await fs.readFile(filePath, "utf-8");
		const parsedData = JSON.parse(reportJson);

		return NextResponse.json(parsedData);
	} catch {
		return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
	}
}
