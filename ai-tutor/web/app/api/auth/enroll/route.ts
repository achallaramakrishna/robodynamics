import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { APP_SESSION_COOKIE, parseAppSession } from "@/lib/appSession";
import { sanitizeNext } from "@/lib/authRouting";
import { upsertProductEnrollment } from "@/lib/productEnrollmentDb";
import { getProductById, normalizeProductId } from "@/lib/productRegistry";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const productSlug = normalizeProductId(url.searchParams.get("product"));
  const product = getProductById(productSlug);
  const safeNext = sanitizeNext(url.searchParams.get("next")) || product?.href || "/";

  if (!product) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const cookieStore = await cookies();
  const session = parseAppSession(cookieStore.get(APP_SESSION_COOKIE)?.value);
  if (!session) {
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("next", safeNext);
    return NextResponse.redirect(loginUrl);
  }

  await upsertProductEnrollment({
    userId: session.userId,
    childId: session.childId,
    productSlug,
    grade: session.grade,
  });

  return NextResponse.redirect(new URL(safeNext, req.url));
}
