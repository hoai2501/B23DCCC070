import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin", "latin-ext"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin", "latin-ext"] });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Classly — Deadline lớp mình, nhớ thật dễ",
    template: "%s | Classly",
  },
  description:
    "Một nơi gọn gàng để cả lớp theo dõi bài tập, lịch kiểm tra và deadline quan trọng.",
  applicationName: "Classly",
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Classly",
    title: "Classly — Deadline lớp mình, nhớ thật dễ",
    description: "Theo dõi mọi bài tập và deadline của lớp trong một nơi.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi" className={`${geist.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
