import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminDashboard from "./AdminDashboard";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("solace-admin")?.value === "true";
  if (!isAdmin) redirect("/");

  return <AdminDashboard />;
}
