import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { AppSidebar } from "@/components/app-sidebar";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  if (!session?.user) redirect("/login?callbackUrl=%2Fdashboard");
  return <div className="dashboard-layout"><AppSidebar isAdmin={session.user.role === "admin"} /><div className="dashboard-content">{children}</div></div>;
}
