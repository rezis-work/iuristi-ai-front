import AIChatPage from "@/src/features/AI/chat/components/chat";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const AUTH_COOKIE_NAMES = ["token", "refreshToken", "refresh_token"];

export default async function Page() {
  const cookieStore = await cookies();
  const hasAuthCookie = AUTH_COOKIE_NAMES.some((name) =>
    Boolean(cookieStore.get(name)?.value?.trim()),
  );

  if (!hasAuthCookie) {
    redirect("/login?next=%2Fai-chat");
  }

  return <AIChatPage />;
}
