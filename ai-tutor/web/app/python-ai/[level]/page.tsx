import { redirect } from "next/navigation";

const LEVEL_REDIRECTS: Record<string, string> = {
  "level-1": "core",
  beginner: "core",
  core: "core",
  "level-2": "fullstack",
  intermediate: "fullstack",
  fullstack: "fullstack",
  "level-3": "datascience",
  advanced: "datascience",
  datascience: "datascience",
  "level-4": "aielite",
  elite: "aielite",
  aielite: "aielite",
};

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
    { level: "level-3" },
    { level: "level-4" },
    { level: "core" },
    { level: "fullstack" },
    { level: "datascience" },
    { level: "aielite" },
  ];
}

export default function PythonAiLevelPage({ params }: { params: { level: string } }) {
  const normalized = LEVEL_REDIRECTS[params.level.trim().toLowerCase()] ?? "core";
  redirect(`/python-ai/course/${normalized}`);
}
