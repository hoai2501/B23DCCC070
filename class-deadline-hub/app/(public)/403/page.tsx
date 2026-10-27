import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";

export default function ForbiddenPage() {
  return <main className="message-page page-container"><span className="message-icon"><ShieldAlert size={27} /></span><span className="section-kicker">KHU VỰC RIÊNG</span><h1>Chỗ này dành<br /><span>cho lớp trưởng thôi.</span></h1><p>Tài khoản của bạn chưa có quyền truy cập trang quản trị.</p><Link className="button button-dark" href="/"><ArrowLeft size={16} /> Về trang chủ</Link></main>;
}
