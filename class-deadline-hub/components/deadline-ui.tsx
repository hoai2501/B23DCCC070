"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarDays, Check, Clock3, Search } from "lucide-react";
import type { Deadline } from "@/lib/types";

const weekdayNames = ["Chủ nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const weekdayNamesEnglish = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function getVietnameseDateParts(value: string) {
  const parts = new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone: "Asia/Ho_Chi_Minh",
  }).formatToParts(new Date(value));
  return Object.fromEntries(parts.map(({ type, value: partValue }) => [type, partValue]));
}

function formatShortDate(value: string) {
  const parts = getVietnameseDateParts(value);
  const weekdayIndex = weekdayNamesEnglish.indexOf(parts.weekday);
  const weekday = weekdayIndex === 0 ? "CN" : `Thứ ${weekdayIndex + 1}`;
  return `${weekday}, ${parts.day}/${parts.month}`;
}

function formatLongDate(value: string) {
  const parts = getVietnameseDateParts(value);
  const weekdayIndex = weekdayNamesEnglish.indexOf(parts.weekday);
  return `lúc ${parts.hour}:${parts.minute} ${weekdayNames[weekdayIndex]}, ${parts.day} tháng ${parts.month}`;
}

export function Countdown({ dueDate }: { dueDate: string }) {
  const [remaining, setRemaining] = useState<number | null>(null);

  useEffect(() => {
    const updateRemaining = () => {
      const due = new Date(dueDate);
      setRemaining(Math.ceil((due.getTime() - Date.now()) / 86_400_000));
    };
    updateRemaining();
    const timer = window.setInterval(updateRemaining, 60_000);
    return () => window.clearInterval(timer);
  }, [dueDate]);

  if (remaining === null) {
    return <span className="countdown" aria-live="polite">Đang tính hạn…</span>;
  }
  if (remaining < 0) {
    return <span className="countdown overdue">Quá hạn {Math.abs(remaining)} ngày</span>;
  }
  if (remaining === 0) {
    return <span className="countdown urgent">Hạn chót hôm nay</span>;
  }
  return <span className="countdown">{remaining === 1 ? "Còn 1 ngày" : `Còn ${remaining} ngày`}</span>;
}

export function DeadlineFilter({ deadlines }: { deadlines: Deadline[] }) {
  const [query, setQuery] = useState("");
  const [subject, setSubject] = useState("all");
  const subjects = useMemo(
    () => [...new Set(deadlines.map((deadline) => deadline.subject))],
    [deadlines],
  );
  const filtered = deadlines.filter((deadline) => {
    const matchesText = `${deadline.title} ${deadline.subject}`.toLowerCase().includes(query.toLowerCase());
    return matchesText && (subject === "all" || deadline.subject === subject);
  });

  return (
    <>
      <div className="filter-toolbar">
        <label className="search-field">
          <Search size={17} />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm deadline, môn học..."
            aria-label="Tìm deadline"
          />
        </label>
        <label className="select-field">
          <span className="sr-only">Lọc theo môn học</span>
          <select value={subject} onChange={(event) => setSubject(event.target.value)}>
            <option value="all">Tất cả môn học</option>
            {subjects.map((name) => <option key={name}>{name}</option>)}
          </select>
        </label>
      </div>
      <div className="deadline-results" aria-live="polite">
        {filtered.length ? filtered.map((deadline) => <DeadlineRow key={deadline.id} deadline={deadline} />) : (
          <div className="empty-state"><Search size={22} /><strong>Chưa tìm thấy deadline phù hợp</strong><span>Thử đổi từ khóa hoặc bộ lọc nhé.</span></div>
        )}
      </div>
    </>
  );
}

export function DeadlineRow({
  deadline,
  completed = false,
}: {
  deadline: Deadline;
  completed?: boolean;
}) {
  const priorityClass = `priority-${deadline.priority}`;
  return (
    <article className={`deadline-row ${completed ? "is-complete" : ""}`}>
      <div className={`date-tile ${priorityClass}`}>
        <CalendarDays size={16} />
        <span>{formatShortDate(deadline.dueDate)}</span>
      </div>
      <div className="deadline-main">
        <div className="deadline-tags">
          <span className={`subject-pill subject-${deadline.subjectSlug}`}>{deadline.subject}</span>
          <span className="type-label">{deadline.type}</span>
        </div>
        <Link href={`/deadlines/${deadline.id}`} className="deadline-title">{deadline.title}</Link>
        <p>{deadline.description}</p>
      </div>
      <div className="deadline-meta">
        {completed ? (
          <span className="completed-label"><Check size={14} /> Đã hoàn thành</span>
        ) : <Countdown dueDate={deadline.dueDate} />}
        <Link className="row-arrow" href={`/deadlines/${deadline.id}`} aria-label={`Xem ${deadline.title}`}>
          <ArrowRight size={17} />
        </Link>
      </div>
    </article>
  );
}

export function DueDateLine({ dueDate }: { dueDate: string }) {
  return (
    <span className="due-date-line">
      <Clock3 size={15} />
      {formatLongDate(dueDate)}
    </span>
  );
}
