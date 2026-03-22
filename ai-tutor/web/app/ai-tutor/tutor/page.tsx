import TutorClient from "./TutorClient";
import "./tutor.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function TutorPageRoute() {
  return <TutorClient />;
}
