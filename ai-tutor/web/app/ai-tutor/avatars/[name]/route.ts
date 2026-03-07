import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";

const ALLOWED = new Set(["3.svg", "4.svg", "5.svg"]);

export async function GET(
  _request: Request,
  { params }: { params: { name: string } }
) {
  const fileName = params.name;
  if (!ALLOWED.has(fileName)) {
    return new NextResponse("Not found", { status: 404 });
  }

  try {
    const filePath = path.join(process.cwd(), "public", "avatars", fileName);
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
