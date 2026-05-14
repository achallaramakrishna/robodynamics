"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RedirectToUnifiedLogin() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/auth/login");
  }, [router]);

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8" }}>
      Redirecting to unified login system...
    </div>
  );
}
