import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck } from "lucide-react";
import { notFound } from "next/navigation";
import { Countdown, DueDateLine } from "@/components/deadline-ui";
import { getDeadline, getDeadlines } from "@/lib/data";
import { DeadlineProgress } from "@/components/deadline-progress";
import { siteUrl } from "@/lib/site";

type Props = { params: Promise<{ id: string }> };

export const revalidate = 3600;

export async function generateStaticParams() {
  const deadlines = await getDeadlines();
  return deadlines.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const deadline = await getDeadline(id);
  if (!deadline) return { title: "Không tìm thấy deadline" };
  return {
    title: deadline.title,
    description: deadline.description,
    openGraph: {
      title: deadline.title,
      description: `${deadline.subject} · Hạn chót ${new Intl.DateTimeFormat("vi-VN", { dateStyle: "long" }).format(new Date(deadline.dueDate))}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: deadline.title,
      description: deadline.description,
    },
  };
}

export default async function DeadlineDetailPage({ params }: Props) {
  const { id } = await params;
  const deadline = await getDeadline(id);
  if (!deadline) notFound();

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Trang chủ", item: `${siteUrl}/` },
      { "@type": "ListItem", position: 2, name: "Deadline", item: `${siteUrl}/deadlines` },
      { "@type": "ListItem", position: 3, name: deadline.title, item: `${siteUrl}/deadlines/${id}` },
    ],
  };

  return (
    <main className="detail-page page-container">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }} />
      <div className="breadcrumb"><Link href="/">Trang chủ</Link><span>/</span><Link href="/deadlines">Deadline</Link><span>/</span><strong>{deadline.subject}</strong></div>
      <div className="detail-layout">
        <article className="detail-article">
          <Link className="back-link" href="/deadlines"><ArrowLeft size={16} /> Tất cả deadline</Link>
          <div className="detail-meta"><span className={`subject-pill subject-${deadline.subjectSlug}`}>{deadline.subject}</span><span className="type-label">{deadline.type}</span><span className={`priority-label priority-text-${deadline.priority}`}>{deadline.priority === "high" ? "Ưu tiên cao" : deadline.priority === "medium" ? "Ưu tiên vừa" : "Ưu tiên thấp"}</span></div>
          <h1>{deadline.title}</h1>
          <div className="detail-date"><DueDateLine dueDate={deadline.dueDate} /><Countdown dueDate={deadline.dueDate} /></div>
          <div className="detail-cover">
            <Image src="/study-desk.svg" alt="Góc học tập và lịch deadline" fill sizes="(max-width: 760px) 100vw, 760px" />
            <div className="cover-caption"><span className="cover-mark"><BookOpenCheck size={17} /></span><span>CLASSLY / LỊCH LỚP MÌNH</span></div>
          </div>
          <div className="detail-description"><span className="section-kicker">THÔNG TIN BÀI TẬP</span><p>{deadline.description}</p><p className="detail-hint">Nhớ dành thời gian kiểm tra lại bài trước khi nộp nha. Cố lên, cả lớp cùng cố gắng! ✨</p></div>
          <div className="detail-footer"><span>Chia sẻ lịch này cho bạn cùng lớp nhé.</span><Link href="/deadlines">Xem các deadline khác <ArrowRight size={15} /></Link></div>
        </article>
        <aside className="detail-aside">
          <DeadlineProgress id={id} />
          <div className="detail-aside-note"><span>✳</span><p>Một chút mỗi ngày<br />là xong trước hạn thôi.</p></div>
        </aside>
      </div>
    </main>
  );
}
