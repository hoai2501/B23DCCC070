"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, CalendarDays, LayoutDashboard, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/deadlines", label: "Lịch deadline", icon: CalendarDays },
];

export function AppSidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-profile"><span className="avatar avatar-large">S</span><div><strong>Không gian của bạn</strong><small>PTIT · Lớp mình</small></div></div>
      <span className="sidebar-label">CÁ NHÂN</span>
      <nav className="sidebar-nav" aria-label="Điều hướng không gian cá nhân">
        {links.map(({ href, label, icon: Icon }) => (
          <Link className={pathname === href ? "active" : ""} href={href} key={href}><Icon size={17} />{label}{pathname === href && <span className="active-mark" />}</Link>
        ))}
        {isAdmin && <Link className={pathname.startsWith("/admin") ? "active" : ""} href="/admin"><ShieldCheck size={17} />Quản trị lớp{pathname.startsWith("/admin") && <span className="active-mark" />}</Link>}
      </nav>
      <div className="sidebar-bottom"><span className="sidebar-bottom-icon">✳</span><p>Chậm mà chắc.<br />Deadline nào cũng qua.</p><Link href="/deadlines">Xem lịch lớp <ArrowUpRight size={14} /></Link></div>
    </aside>
  );
}
