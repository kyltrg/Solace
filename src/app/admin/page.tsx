import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const adminVal = cookieStore.get("solace-admin")?.value;
  const isAdmin = adminVal === "true" || adminVal?.length === 36;
  if (!isAdmin) redirect("/");

  return <AdminDashboard />;
}
