import { redirect } from "next/navigation";

export default function LegacyLoginRedirect({
  searchParams,
}: {
  searchParams?: { next?: string };
}) {
  const next = searchParams?.next;
  if (next && next.startsWith("/")) {
    redirect(`/auth/login?next=${encodeURIComponent(next)}`);
  }
  redirect("/auth/login");
}
