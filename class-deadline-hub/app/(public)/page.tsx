import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleCheck,
  Clock3,
  Layers3,
  Network,
  Sparkles,
} from "lucide-react";
import { currentTimestamp, getDeadlines, subjects } from "@/lib/data";
import { DeadlineRow } from "@/components/deadline-ui";

export const dynamic = "force-static";

const icons = [Layers3, Network, BookOpen, CircleCheck];

export default async function HomePage() {
  const deadlines = await getDeadlines();
  const upcoming = deadlines
    .filter((deadline) => new Date(deadline.dueDate).getTime() >= currentTimestamp())
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  return (
    <main>
      <section className="hero-section">
        <div className="hero-backdrop" aria-hidden="true" />
        <div className="hero-grid page-container">
          <div className="hero-copy">
            <div className="eyebrow"><span className="live-dot" /> KHÔNG BỎ LỠ NHỊP NÀO CỦA LỚP</div>
            <h1>Deadline bớt rối.<br /><span>Học hành thảnh thơi.</span></h1>
            <p>Mọi bài tập, lịch kiểm tra và hạn nộp của lớp — gói gọn trong một góc nhỏ, dễ nhìn, dễ nhớ.</p>
            <div className="hero-actions">
              <Link className="button button-dark" href="/deadlines">Xem deadline lớp mình <ArrowRight size={17} /></Link>
              <Link className="text-link" href="#how-it-works">Khám phá thêm <ArrowDownRight size={16} /></Link>
            </div>
            <div className="hero-social-proof">
              <div className="avatar-stack"><span>H</span><span>M</span><span>A</span><span>+</span></div>
              <span>Đang giúp cả lớp <strong>theo kịp lịch học</strong></span>
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-image-frame">
              <Image src="/study-desk.svg" alt="Góc học tập cùng lịch deadline gọn gàng" fill priority sizes="(max-width: 760px) 90vw, 46vw" />
            </div>
            <div className="floating-note note-top"><span className="note-icon"><Sparkles size={16} /></span><span><strong>Nhẹ đầu hơn rồi!</strong><small>3 deadline sắp tới</small></span></div>
            <div className="floating-note note-bottom"><span className="note-check"><Check size={16} /></span><span><strong>Lab 04 hoàn thành</strong><small>Tiến độ học tập +1</small></span></div>
            <div className="hero-sticker"><span>ít quên</span><strong>hơn ♡</strong></div>
          </div>
        </div>
        <div className="hero-bottom page-container">
          <span>THIẾT KẾ CHO LỚP MÌNH</span>
          <div className="hero-bottom-line" />
          <span className="hero-bottom-note">Một chiếc hub nhỏ, cả lớp an tâm.</span>
        </div>
      </section>

      <section className="section section-upcoming">
        <div className="page-container">
          <div className="section-heading">
            <div><span className="section-kicker">LỊCH LỚP MÌNH</span><h2>Việc cần làm <span>sắp tới</span></h2></div>
            <Link className="link-with-arrow" href="/deadlines">Tất cả deadline <ArrowUpRight size={16} /></Link>
          </div>
          <div className="upcoming-layout">
            <div className="deadline-list">
              {upcoming.map((deadline) => <DeadlineRow key={deadline.id} deadline={deadline} />)}
            </div>
            <aside className="week-card">
              <div className="week-card-head"><span className="week-icon"><Clock3 size={18} /></span><span className="week-label">NHẮC NHẸ NÈ</span></div>
              <h3>Chia nhỏ việc,<br />nhẹ cả tuần.</h3>
              <p>Đừng để sát giờ mới bắt đầu. Mỗi ngày một chút là deadline nào cũng ổn!</p>
              <Link href="/deadlines" className="week-card-link">Lên lịch tuần này <ChevronRight size={16} /></Link>
              <div className="week-card-art" aria-hidden="true">✳</div>
            </aside>
          </div>
        </div>
      </section>

      <section className="section section-subjects" id="subjects">
        <div className="page-container">
          <div className="section-heading">
            <div><span className="section-kicker">GÓC HỌC TẬP</span><h2>Mỗi môn một <span>góc riêng</span></h2></div>
            <p className="section-heading-note">Tìm nhanh deadline theo môn,<br />khỏi phải lục lại tin nhắn.</p>
          </div>
          <div className="subject-grid">
            {subjects.map((subject, index) => {
              const Icon = icons[index];
              const count = deadlines.filter((deadline) => deadline.subjectSlug === subject.slug).length;
              return (
                <Link href={`/subjects/${subject.slug}`} className={`subject-card subject-card-${subject.color}`} key={subject.slug}>
                  <div className="subject-card-top"><span className="subject-icon"><Icon size={20} /></span><ArrowUpRight size={16} /></div>
                  <div><span className="subject-card-short">{subject.shortName}</span><h3>{subject.name}</h3></div>
                  <span className="subject-card-count">{count} deadline <ArrowRight size={13} /></span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section section-how" id="how-it-works">
        <div className="page-container how-layout">
          <div className="how-copy"><span className="section-kicker">TẬP TRUNG VÀO VIỆC HỌC</span><h2>Ít mở chat hơn.<br /><span>Nhiều thời gian cho mình hơn.</span></h2><p>Deadline được gom về đúng một chỗ. Cả lớp cùng cập nhật, mỗi người tự đánh dấu tiến độ — rõ ràng mà không ồn ào.</p><Link className="text-link" href="/login">Vào không gian của bạn <ArrowRight size={16} /></Link></div>
          <div className="how-steps">
            <div className="how-step"><span>01</span><div><h3>Mở lịch lớp</h3><p>Xem mọi bài tập và hạn nộp công khai, không cần đăng nhập.</p></div><Check size={16} /></div>
            <div className="how-step"><span>02</span><div><h3>Đánh dấu tiến độ</h3><p>Đăng nhập để tick những việc bạn đã hoàn thành.</p></div><Check size={16} /></div>
            <div className="how-step"><span>03</span><div><h3>Yên tâm học tiếp</h3><p>Biết mình đang ở đâu, còn việc gì phía trước.</p></div><Check size={16} /></div>
          </div>
        </div>
      </section>

      <footer className="site-footer"><div className="page-container footer-inner"><Link className="brand" href="/"><span className="brand-mark"><BookOpen size={17} /></span><span>classly<span className="brand-dot">.</span></span></Link><span>Made for our class, with a little less chaos.</span><Link href="/deadlines">Lịch deadline <ArrowRight size={14} /></Link></div></footer>
    </main>
  );
}
