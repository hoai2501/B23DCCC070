import { ImageResponse } from "next/og";
import { getDeadline } from "@/lib/data";
import { siteUrl } from "@/lib/site";

export const alt = "Thông tin deadline của lớp";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const deadline = await getDeadline(id);
  if (!deadline) return new Response("Không tìm thấy deadline", { status: 404 });

  return new ImageResponse(
    <div style={{
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "58px 70px", color: "#203b31",
      background: "linear-gradient(135deg, #f8f6ef 0%, #e8eee4 100%)",
      fontFamily: "sans-serif",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 32.4, fontWeight: 700 }}>
        <div style={{ display: "flex", width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", background: "#dce9d9", fontSize: 30 }}>✳</div>
        classly<span style={{ color: "#d69d64" }}>.</span>
        <span style={{ fontSize: 19.200000000000003, fontWeight: 500, marginLeft: 12, color: "#738076" }}>LỊCH LỚP MÌNH</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 1000 }}>
        <div style={{ display: "flex", fontSize: 24, color: "#667a69", fontWeight: 600 }}>{deadline.subject} · {deadline.type}</div>
        <div style={{ display: "flex", fontSize: 69.60000000000001, lineHeight: 1.15, fontWeight: 700, letterSpacing: -3 }}>{deadline.title}</div>
        <div style={{ display: "flex", fontSize: 28.8, color: "#607065" }}>
          Hạn chót {new Intl.DateTimeFormat("vi-VN", { dateStyle: "long", timeStyle: "short" }).format(new Date(deadline.dueDate))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 20.400000000000002, color: "#728076" }}>
        <span>Mọi deadline, gọn trong một chỗ.</span><span>{new URL(siteUrl).host}</span>
      </div>
    </div>,
    size,
  );
}
