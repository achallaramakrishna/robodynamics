import MindSparcLevelClient from "./MindSparcLevelClient";

export function generateStaticParams() {
  return [
    { level: "level-1" },
    { level: "level-2" },
    { level: "level-3" },
    { level: "level-4" },
    { level: "level-5" },
  ];
}

export default function MindSparcLevelPage() {
  return <MindSparcLevelClient />;
}
