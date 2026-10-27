"use client";

import { useEffect } from "react";
import { RotateCcw, TriangleAlert } from "lucide-react";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return <main className="message-page page-container"><span className="message-icon message-error"><TriangleAlert size={26} /></span><span className="section-kicker">CÓ CHÚT TRỤC TRẶC</span><h1>Trang chưa tải<br /><span>được mất rồi.</span></h1><p>Đã có lỗi xảy ra khi tải nội dung. Bạn thử lại sau một chút nhé.</p><button className="button button-dark" onClick={reset}><RotateCcw size={15} /> Thử lại</button></main>;
}
