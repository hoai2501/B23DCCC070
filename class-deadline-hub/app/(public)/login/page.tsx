import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpenCheck, LockKeyhole } from "lucide-react";
import { LoginForm } from "@/components/login-form";

export const metadata: Metadata = {
  title: "Đăng nhập",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { callbackUrl, error } = await searchParams;
  return (
    <main className="login-page">
      <section className="login-visual">
        <Link className="brand login-brand" href="/"><span className="brand-mark"><BookOpenCheck size={18} /></span><span>classly<span className="brand-dot">.</span></span></Link>
        <div className="login-visual-copy"><span className="section-kicker">GÓC NHỎ CỦA LỚP MÌNH</span><h1>Học nhẹ nhàng,<br /><span>cùng nhau nhé.</span></h1><p>Lịch rõ ràng một chút, đầu óc thảnh thơi thêm nhiều.</p></div>
        <div className="login-image"><Image src="/study-desk.svg" alt="Góc học tập Classly" fill sizes="50vw" /></div>
        <span className="login-visual-foot">A little more focus, a little less chaos.</span>
      </section>
      <section className="login-form-side">
        <div className="login-card">
          <Link className="back-link" href="/"><ArrowLeft size={15} /> Về trang chủ</Link>
          <span className="login-lock"><LockKeyhole size={20} /></span>
          <span className="section-kicker">CHÀO MỪNG TRỞ LẠI</span>
          <h2>Đăng nhập nhé.</h2>
          <p className="login-intro">Vào không gian riêng để theo dõi tiến độ học tập của bạn.</p>
          {error && <div className="form-error" role="alert">Email hoặc mật khẩu chưa chính xác. Bạn thử lại nhé.</div>}
          <LoginForm callbackUrl={callbackUrl} />
          <div className="login-demo"><span>TÀI KHOẢN DÙNG THỬ</span><div><code>sv@ptit.edu.vn</code><span>·</span><code>sv123456</code></div></div>
          <p className="login-public-note">Chưa cần đăng nhập? <Link href="/deadlines">Xem deadline công khai <ArrowRight size={13} /></Link></p>
        </div>
      </section>
    </main>
  );
}
