import Link from "next/link";
import { BookOpenCheck } from "lucide-react";
import { SessionHeaderActions } from "@/components/session-header-actions";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="Classly trang chủ">
          <span className="brand-mark"><BookOpenCheck size={19} strokeWidth={2.2} /></span>
          <span>classly<span className="brand-dot">.</span></span>
        </Link>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <Link href="/deadlines">Deadline</Link>
          <Link href="/#subjects">Môn học</Link>
          <Link href="/dashboard">Không gian của bạn</Link>
        </nav>
        <SessionHeaderActions />
      </div>
    </header>
  );
}
