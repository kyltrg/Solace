import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import WelcomeContent from "@/components/WelcomeContent";

function isSessionValid(cookieValue: string | undefined): boolean {
  if (!cookieValue) return false;
  return !isNaN(Number(cookieValue));
}

export default async function Page(): Promise<React.JSX.Element> {
  const cookieStore = await cookies();
  const access = cookieStore.get("solace-access");

  if (isSessionValid(access?.value)) {
    redirect("/home");
  }

  return <WelcomeContent />;
}
