import { redirect } from "next/navigation";

// /vedic-math → the MindSutra product landing page
export default function VedicMathRoot() {
  redirect("/mindsutra");
}
