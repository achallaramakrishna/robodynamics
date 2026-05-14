import { normalizeProductId } from "@/lib/productRegistry";

export function sanitizeNext(nextValue?: string | null) {
  if (!nextValue || !nextValue.startsWith("/")) return null;
  return nextValue;
}

export function inferProductFromPath(pathname?: string | null) {
  const path = String(pathname || "").trim().toLowerCase();
  if (path.startsWith("/mindsparc")) return "mindsparc";
  if (path.startsWith("/mindsutra")) return "mindsutra";
  if (path.startsWith("/python-ai")) return "python-ai";
  if (path.startsWith("/vidya")) return "vidya";
  if (path.startsWith("/moneymind")) return "moneymind";
  if (path.startsWith("/hindiguru")) return "hindiguru";
  if (path.startsWith("/ai-tutor/neet")) return "neet";
  if (path.startsWith("/vaani")) return "vaani";
  if (path.startsWith("/kaveri")) return "kaveri";
  return "mindsutra";
}

export function buildPostAuthUrl(nextValue?: string | null) {
  const next = sanitizeNext(nextValue);
  if (!next) return "/";

  return next;
}

export function inferEnrollmentProductFromPath(pathname?: string | null) {
  return normalizeProductId(inferProductFromPath(pathname));
}
