import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";
import { DeadlineRow } from "@/components/deadline-ui";
import { currentTimestamp, getDeadlines, getSubjectDeadlines, subjects } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return subjects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const subject = subjects.find((item) => item.slug === slug);
  if (!subject) return { title: "Không tìm thấy môn học" };
  return {
    title: `Deadline môn ${subject.name}`,
    description: `Tổng hợp deadline, bài tập và lịch kiểm tra môn ${subject.name}.`,
  };
}

export default async function SubjectPage({ params }: Props) {
  const { slug } = await params;
  const subject = subjects.find((item) => item.slug === slug);
  if (!subject) notFound();
  const deadlines = await getSubjectDeadlines(slug);
  const allDeadlines = await getDeadlines();
  const upcoming = deadlines.filter((deadline) => new Date(deadline.dueDate).getTime() >= currentTimestamp());

  return (
    <main className="page-main">
      <section className="subject-hero page-container">
        <div className="breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/#subjects">Môn học</Link><span>/</span><strong>{subject.shortName}</strong></div>
        <Link className="back-link" href="/#subjects"><ArrowLeft size={15} /> Tất cả môn học</Link>
        <div className="subject-hero-grid">
          <div><span className={`subject-pill subject-${slug}`}>MÔN HỌC</span><h1>{subject.name}<span>.</span></h1><p>Deadline của môn học này, được gom gọn để bạn dễ theo dõi.</p></div>
          <div className="subject-summary"><BookOpen size={19} /><strong>{deadlines.length}</strong><span>deadline tất cả</span><div /><CalendarDays size={16} /><strong>{upcoming.length}</strong><span>việc sắp tới</span></div>
        </div>
      </section>
      <section className="page-container subject-deadlines"><div className="browser-heading"><div><h2>Lịch môn học</h2><p>{allDeadlines.length} deadline được cập nhật từ lớp trưởng</p></div><Link className="subtle-link" href="/deadlines">Xem toàn bộ <ArrowRight size={15} /></Link></div><div className="deadline-list">{deadlines.sort((a, b) => a.dueDate.localeCompare(b.dueDate)).map((deadline) => <DeadlineRow deadline={deadline} key={deadline.id} />)}</div></section>
    </main>
  );
}
