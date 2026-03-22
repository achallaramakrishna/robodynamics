// Server component — owns generateStaticParams (required by Next.js 14 App Router).
// All interactive/client logic lives in VedicMathGradeClient.tsx.

import VedicMathGradeClient from "./VedicMathGradeClient";

export function generateStaticParams() {
  return [
    { grade: "grade-4" },
    { grade: "grade-5" },
    { grade: "grade-6" },
    { grade: "grade-7" },
    { grade: "grade-8" },
  ];
}

export default function VedicMathGradePage() {
  return <VedicMathGradeClient />;
}
