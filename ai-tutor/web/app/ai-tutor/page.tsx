import { redirect } from "next/navigation";

// /ai-tutor → redirect to the tutor workspace
export default function AiTutorRoot() {
  redirect("/ai-tutor/tutor");
}
