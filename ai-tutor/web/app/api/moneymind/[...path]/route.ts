import { NextRequest, NextResponse } from "next/server";
import { callTutorApi } from "@/lib/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const searchParams = request.nextUrl.searchParams.toString();
    const fullPath = `/ai-tutor-api/moneymind/${path}${searchParams ? `?${searchParams}` : ""}`;
    
    const data = await callTutorApi(fullPath, "GET");
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to call MoneyMind API" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = params.path.join("/");
    const payload = await request.json();
    const fullPath = `/ai-tutor-api/moneymind/${path}`;
    
    const data = await callTutorApi(fullPath, "POST", payload);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to call MoneyMind API" },
      { status: 500 }
    );
  }
}
