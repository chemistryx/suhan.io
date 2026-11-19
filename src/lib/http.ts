import { NextResponse } from "next/server";

// User-facing error: a Korean message only. Log the details separately.
export const errorResponse = (message: string, status: number) => NextResponse.json({ error: message }, { status });
