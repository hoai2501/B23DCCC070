"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { SessionProvider, useSession } from "next-auth/react";
import { ArrowRight, Check, LockKeyhole, RotateCcw } from "lucide-react";
import { completeDeadlineAction } from "@/app/actions";

function ProgressCard({ id }: { id: string }) {
  const { data: session, status } = useSession();
  const [completed, setCompleted] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(true);
  const [progressError, setProgressError] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;
    fetch(`/api/progress/${id}`, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Không thể tải trạng thái tiến độ.");
        return response.json() as Promise<{ completed: boolean }>;
      })
      .then((result) => {
        if (active) setCompleted(result.completed);
      })
      .catch(() => {
        if (active) setProgressError(true);
      })
      .finally(() => {
        if (active) setLoadingProgress(false);
      });
    return () => { active = false; };
  }, [id, status]);

  if (status === "loading") {
    return <div className="action-card"><span className="section-kicker">TIẾN ĐỘ CỦA BẠN</span><div className="loading-mark progress-loading" /><p>Đang tải tiến độ...</p></div>;
  }
  if (!session?.user || (session.user.role !== "user" && session.user.role !== "admin")) {
    return <div className="action-card"><span className="section-kicker">TIẾN ĐỘ CỦA BẠN</span><span className="action-lock"><LockKeyhole size={21} /></span><h2>Lưu tiến độ riêng</h2><p>Đăng nhập để đánh dấu deadline này đã hoàn thành.</p><Link className="button button-dark button-full" href={`/login?callbackUrl=${encodeURIComponent(`/deadlines/${id}`)}`}>Đăng nhập <ArrowRight size={16} /></Link></div>;
  }
  if (completed) {
    return <div className="action-card"><span className="section-kicker">TIẾN ĐỘ CỦA BẠN</span><span className="action-check"><Check size={22} /></span><h2>Hoàn thành rồi!</h2><p>Deadline này đã được đánh dấu xong trong không gian cá nhân.</p></div>;
  }
  return <div className="action-card">
    <span className="section-kicker">TIẾN ĐỘ CỦA BẠN</span><span className="action-check action-check-muted"><Check size={22} /></span><h2>Xong bài này?</h2><p>Đánh dấu hoàn thành để dễ theo dõi tiến độ học tập của bạn.</p>
    {progressError ? <div className="progress-error" role="alert">Không tải được trạng thái đã hoàn thành. Thử lại trước khi đánh dấu nhé.<button className="progress-retry" onClick={() => window.location.reload()}><RotateCcw size={13} /> Thử lại</button></div> : loadingProgress ? <p>Đang kiểm tra tiến độ…</p> : <form action={async (formData) => { await completeDeadlineAction(formData); setCompleted(true); }}><input type="hidden" name="id" value={id} /><button className="button button-dark button-full">Đánh dấu hoàn thành <Check size={16} /></button></form>}
  </div>;
}

export function DeadlineProgress({ id }: { id: string }) {
  return <SessionProvider><ProgressCard id={id} /></SessionProvider>;
}
