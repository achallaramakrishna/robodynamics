import type { ReactNode } from "react";

// Note: html/body are owned by the root app/layout. This nested layout just wraps children.
export default function VedicMathGradeLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
