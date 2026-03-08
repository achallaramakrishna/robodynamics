import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const SAFE_NAME = /^[a-z0-9_]+\.svg$/;

export async function GET(
  _request: Request,
  { params }: { params: { name: string } }
) {
  const fileName = (params.name || "").toLowerCase();
  if (!SAFE_NAME.test(fileName)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "teacher_1", "svg", fileName);
    const svg = await readFile(filePath, "utf-8");
    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml; charset=utf-8",
        "Cache-Control": "public, max-age=86400"
      }
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
