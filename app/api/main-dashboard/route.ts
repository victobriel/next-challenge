import { DashboardData } from "@/lib/types";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest): Promise<NextResponse<DashboardData | { error: string }>> {
  const period = req.nextUrl.searchParams.get("period");

  if (period !== "monthly" && period !== "quarterly" && period !== "yearly") {
    return NextResponse.json({ error: "Invalid period" }, { status: 400 });
  }

	try {
    const filePath = process.cwd() + `/app/api/main-dashboard/data/${period}.json`;

    const dashboardJson = await fs.readFile(filePath, "utf-8");
    const parsedData = JSON.parse(dashboardJson);

    return NextResponse.json(parsedData);
  } catch {
    return NextResponse.json({ error: "Failed to load data" }, { status: 500 });
  }
}
