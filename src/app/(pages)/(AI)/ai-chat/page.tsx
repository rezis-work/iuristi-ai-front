import AIChatPage from "@/src/features/AI/chat/components/chat";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value?.trim();

  if (!token) {
    redirect("/login?next=%2Fai-chat");
  }

  return <AIChatPage />;
}
