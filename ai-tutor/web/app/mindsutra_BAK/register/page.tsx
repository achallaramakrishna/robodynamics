import { redirect } from "next/navigation";

export default function MindSutraRegisterRedirect() {
  redirect("/auth/register?source=mindsutra");
}
