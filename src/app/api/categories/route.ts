import { fetchCategoryCounts } from "@/lib/records";
import { NextResponse } from "next/server";

// Sidebar counts, fetched client-side so the layout stays static.
export async function GET() {
    try {
        return NextResponse.json(await fetchCategoryCounts());
    } catch (e) {
        console.error("categories failed", e);
        return NextResponse.json({ error: "카테고리를 불러오지 못했습니다." }, { status: 500 });
    }
}
