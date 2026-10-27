import Link from "next/link";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return <main className="message-page page-container"><span className="message-icon"><SearchX size={27} /></span><span className="section-kicker">404 · KHÔNG TÌM THẤY</span><h1>Trang này đi<br /><span>lạc mất rồi.</span></h1><p>Deadline có thể đã bị xoá hoặc đường dẫn không còn chính xác.</p><Link className="button button-dark" href="/deadlines"><ArrowLeft size={16} /> Về lịch deadline</Link></main>;
}
