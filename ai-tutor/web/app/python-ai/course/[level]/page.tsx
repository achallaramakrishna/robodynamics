import PythonAiBrowser from "@/app/python-ai/PythonAiBrowser";

export function generateStaticParams() {
  return [
    { level: "core" },
    { level: "fullstack" },
    { level: "datascience" },
    { level: "aielite" },
  ];
}

export default function PythonAiCoursePage({
  params,
  searchParams,
}: {
  params: { level: string };
  searchParams?: { chapter?: string };
}) {
  return <PythonAiBrowser levelSlug={params.level} initialChapterId={searchParams?.chapter} />;
}
