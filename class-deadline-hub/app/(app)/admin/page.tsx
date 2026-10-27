import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarPlus, Check, ClipboardList, Trash2 } from "lucide-react";
import { auth } from "@/auth";
import { createDeadlineAction, deleteDeadlineAction } from "@/app/actions";
import { getDeadlines } from "@/lib/data";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Quản trị deadline",
  robots: { index: false, follow: false },
};

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ deleted?: string }>;
}) {
  const session = await auth();
  const role: Role = session?.user.role ?? "guest";
  if (!can(role, "addDeadline") || !can(role, "deleteDeadline")) redirect("/403");
  const [deadlines, query] = await Promise.all([getDeadlines(), searchParams]);
  const sorted = deadlines.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  return <main className="admin-main">
    <div className="dashboard-greeting"><div><span className="section-kicker">QUẢN LÝ LỊCH LỚP</span><h1>Góc lớp trưởng<span>.</span></h1><p>Thêm deadline mới, cả lớp sẽ thấy ngay trong lịch chung.</p></div><Link className="button button-dark" href="/deadlines">Xem lịch công khai <ArrowRight size={15} /></Link></div>
    {query.deleted && <div className="success-banner"><Check size={16} /> Đã xoá deadline khỏi lịch lớp.</div>}
    <div className="admin-grid">
      <section className="admin-form-card"><div className="admin-card-heading"><span className="admin-heading-icon"><CalendarPlus size={19} /></span><div><h2>Thêm deadline</h2><p>Điền thông tin bài tập hoặc lịch kiểm tra.</p></div></div>
        <form action={createDeadlineAction} className="admin-form">
          <label>Tên deadline<input name="title" type="text" placeholder="Ví dụ: Bài tập lớn — Phân tích hệ thống" minLength={4} maxLength={120} required /></label>
          <div className="form-grid-two"><label>Môn học<select name="subjectSlug" required><option value="">Chọn môn học</option><option value="phan-tich-thiet-ke">Phân tích thiết kế hệ thống</option><option value="mang-may-tinh">Mạng máy tính</option><option value="lap-trinh-web">Lập trình Web</option><option value="co-so-du-lieu">Cơ sở dữ liệu</option></select></label><label>Loại bài<input name="type" type="text" placeholder="Bài tập, Quiz..." minLength={2} maxLength={32} required /></label></div>
          <label>Hạn chót<input name="dueDate" type="datetime-local" required /></label>
          <label>Mô tả<textarea name="description" rows={4} placeholder="Mô tả ngắn gọn yêu cầu cần hoàn thành..." minLength={10} maxLength={1000} required /></label>
          <label>Mức độ ưu tiên<select name="priority" defaultValue="medium"><option value="low">Thấp — có thể lên kế hoạch sau</option><option value="medium">Vừa — nên bắt đầu sớm</option><option value="high">Cao — ưu tiên hoàn thành</option></select></label>
          <button className="button button-dark button-full">Thêm vào lịch lớp <CalendarPlus size={16} /></button>
        </form>
      </section>
      <section className="admin-manage-card"><div className="admin-card-heading"><span className="admin-heading-icon admin-heading-soft"><ClipboardList size={19} /></span><div><h2>Deadline hiện có</h2><p>{deadlines.length} mục trong lịch lớp</p></div></div>
        <div className="admin-deadline-list">{sorted.map((deadline) => <article className="admin-deadline-item" key={deadline.id}><div><span className={`subject-pill subject-${deadline.subjectSlug}`}>{deadline.subject}</span><Link href={`/deadlines/${deadline.id}`}>{deadline.title}</Link><small>{new Intl.DateTimeFormat("vi-VN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(deadline.dueDate))}</small></div><form action={deleteDeadlineAction}><input type="hidden" name="id" value={deadline.id} /><button className="delete-button" aria-label={`Xoá ${deadline.title}`} title="Xoá deadline"><Trash2 size={16} /></button></form></article>)}</div>
      </section>
    </div>
    <p className="admin-footnote">Thay đổi sẽ được cập nhật ngay lên lịch deadline công khai.</p>
  </main>;
}
