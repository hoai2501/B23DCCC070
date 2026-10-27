import type { Metadata } from "next";
import { ArrowDown, CalendarDays, CheckCircle2 } from "lucide-react";
import { DeadlineFilter } from "@/components/deadline-ui";
import { currentTimestamp, getDeadlines } from "@/lib/data";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Lịch deadline lớp mình",
  description: "Tra cứu bài tập, bài kiểm tra và hạn nộp của các môn học trong lớp.",
};

export default async function DeadlinesPage() {
  const deadlines = (await getDeadlines()).sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  const nextDeadline = deadlines.find((deadline) => new Date(deadline.dueDate).getTime() >= currentTimestamp());
  const subjects = new Set(deadlines.map((deadline) => deadline.subject));

  return (
    <main className="page-main">
      <section className="page-hero page-container">
        <div className="page-hero-copy">
          <div className="breadcrumb"><span>Trang chủ</span><span>/</span><strong>Deadline</strong></div>
          <span className="section-kicker">CẬP NHẬT CÙNG CẢ LỚP</span>
          <h1>Lịch deadline<br /><span>của lớp mình.</span></h1>
          <p>Rõ việc cần làm, rõ hạn chót. Chọn môn hoặc tìm nhanh theo tên bài nhé.</p>
        </div>
        <div className="overview-card">
          <div className="overview-card-top"><span className="overview-icon"><CalendarDays size={18} /></span><span>ĐANG THEO DÕI</span></div>
          <div className="overview-stats"><strong>{deadlines.length.toString().padStart(2, "0")}</strong><span>deadline<br />trong lớp</span></div>
          <div className="overview-divider" />
          <div className="overview-foot"><span><CheckCircle2 size={15} /> {subjects.size} môn học</span><span>{nextDeadline ? `Hạn gần nhất ${new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "2-digit" }).format(new Date(nextDeadline.dueDate))}` : "Chưa có hạn sắp tới"}</span></div>
        </div>
      </section>

      <section className="page-container deadline-browser">
        <div className="browser-heading">
          <div><h2>Tất cả deadline</h2><p>Cập nhật mới nhất · Tự làm mới mỗi 60 giây</p></div>
          <a className="subtle-link" href="#deadline-list">Cuộn để xem <ArrowDown size={15} /></a>
        </div>
        <div id="deadline-list"><DeadlineFilter deadlines={deadlines} /></div>
        <div className="public-note"><span className="note-bullet" /> Lịch này công khai với tất cả thành viên lớp.</div>
      </section>
    </main>
  );
}
