import { NextResponse } from "next/server";
import { APP_SESSION_COOKIE } from "@/lib/appSession";

function buildLoggedOutResponse(request: Request) {
  const redirectUrl = new URL("/", request.url);
  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set(APP_SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    expires: new Date(0),
    path: "/",
  });
  return response;
}

export async function GET(request: Request) {
  return buildLoggedOutResponse(request);
}

export async function POST(request: Request) {
  return buildLoggedOutResponse(request);
}
