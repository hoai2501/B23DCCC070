import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, CircleCheck, Clock3, Sparkles } from "lucide-react";
import { auth } from "@/auth";
import { DeadlineRow } from "@/components/deadline-ui";
import { currentTimestamp, getDeadlines, isDeadlineComplete } from "@/lib/data";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Không gian của bạn",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const session = await auth();
  const email = session?.user.email;
  if (!email) throw new Error("Không thể tải thông tin phiên đăng nhập.");
  const deadlines = (await getDeadlines()).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const completedStates = await Promise.all(deadlines.map((deadline) => isDeadlineComplete(deadline.id, email)));
  const completedCount = completedStates.filter(Boolean).length;
  const upcoming = deadlines.filter((deadline, index) => !completedStates[index] && new Date(deadline.dueDate).getTime() >= currentTimestamp()).slice(0, 4);
  const completionRate = deadlines.length ? Math.round((completedCount / deadlines.length) * 100) : 0;
  const greetingName = session.user.role === "admin" ? "lớp trưởng" : "bạn";

  return <main className="dashboard-main">
    <div className="dashboard-greeting"><div><span className="section-kicker">THỨC DẬY LÀ BIẾT VIỆC CẦN LÀM</span><h1>Chào {greetingName} <span>👋</span></h1><p>Cứ từ từ nhé, hôm nay mình tiến thêm một chút là được.</p></div><div className="dashboard-date">{new Intl.DateTimeFormat("vi-VN", { weekday: "long", day: "2-digit", month: "long" }).format(new Date())}</div></div>
    <div className="dashboard-stats">
      <div className="dash-stat-card"><span className="dash-stat-icon stat-icon-green"><CircleCheck size={19} /></span><span className="dash-stat-label">ĐÃ HOÀN THÀNH</span><strong>{completedCount}<small> / {deadlines.length}</small></strong><div className="stat-progress"><span style={{ width: `${completionRate}%` }} /></div><p>{completionRate ? `${completionRate}% chặng đường rồi đó` : "Bắt đầu từ deadline đầu tiên nhé"}</p></div>
      <div className="dash-stat-card"><span className="dash-stat-icon stat-icon-orange"><Clock3 size={19} /></span><span className="dash-stat-label">ĐANG CHỜ BẠN</span><strong>{upcoming.length}<small> việc sắp tới</small></strong><div className="stat-detail">Lọc theo lịch deadline của lớp</div><Link href="/deadlines">Xem toàn bộ <ArrowRight size={14} /></Link></div>
      <div className="dash-stat-card dash-mood-card"><span className="mood-spark"><Sparkles size={20} /></span><span className="dash-stat-label">NHẮC NHẸ</span><h3>Mỗi lần hoàn thành<br />là một lần nhẹ đầu.</h3><span className="mood-decoration">✳</span></div>
    </div>
    <section className="dashboard-list-section"><div className="browser-heading"><div><h2>Việc tiếp theo</h2><p>Các deadline chưa hoàn thành của bạn</p></div><Link className="subtle-link" href="/deadlines">Mở lịch lớp <ArrowRight size={15} /></Link></div>
      {upcoming.length ? <div className="deadline-list">{upcoming.map((deadline) => <DeadlineRow deadline={deadline} key={deadline.id} />)}</div> : <div className="dashboard-empty"><span><Check size={20} /></span><strong>Không còn deadline sắp tới!</strong><p>Bạn đã làm tốt lắm. Dành chút thời gian nghỉ ngơi nhé.</p></div>}
    </section>
  </main>;
}
