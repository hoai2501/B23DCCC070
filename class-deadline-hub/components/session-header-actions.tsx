"use client";

import Link from "next/link";
import { signOut, SessionProvider, useSession } from "next-auth/react";
import { ArrowUpRight, LogOut } from "lucide-react";

function HeaderActions() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return <div className="header-actions" aria-hidden="true"><span className="header-placeholder" /></div>;
  }
  if (!session?.user) {
    return <div className="header-actions"><Link className="button button-dark button-small" href="/login">Đăng nhập <ArrowUpRight size={15} /></Link></div>;
  }
  return (
    <div className="header-actions">
      <span className="user-chip">
        <span className="avatar">{session.user.name?.slice(0, 1) ?? "S"}</span>
        <span className="user-chip-copy"><strong>{session.user.name}</strong><small>{session.user.role === "admin" ? "Lớp trưởng" : "Sinh viên"}</small></span>
      </span>
      <button className="icon-button" aria-label="Đăng xuất" title="Đăng xuất" onClick={() => signOut({ redirectTo: "/" })}><LogOut size={17} /></button>
    </div>
  );
}

export function SessionHeaderActions() {
  return <SessionProvider><HeaderActions /></SessionProvider>;
}
