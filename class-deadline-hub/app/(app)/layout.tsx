import { SiteHeader } from "@/components/site-header";

export default function AppLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <><SiteHeader /><div className="app-content">{children}</div></>;
}
