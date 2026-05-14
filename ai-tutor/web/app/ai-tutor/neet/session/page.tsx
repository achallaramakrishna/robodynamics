import NeetTutorClient from "../NeetTutorClient";

export default function NeetSessionPage({
  searchParams,
}: {
  searchParams?: { subject?: string; chapter?: string; class?: string };
}) {
  const subject = searchParams?.subject || "biology";
  const chapter = searchParams?.chapter || "BIO_PHOTOSYNTHESIS";
  const studentClass = searchParams?.class || "11";

  return (
    <NeetTutorClient
      initialSubject={subject}
      initialChapter={chapter}
      studentClass={studentClass}
    />
  );
}
