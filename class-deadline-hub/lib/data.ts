import "server-only";
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Deadline, Subject } from "@/lib/types";

const dataDirectory = path.join(process.cwd(), "data");
const deadlinesPath = path.join(dataDirectory, "deadlines.json");
const progressPath = path.join(dataDirectory, "progress.json");

export const subjects: Subject[] = [
  { name: "Phân tích thiết kế hệ thống", slug: "phan-tich-thiet-ke", shortName: "PTTK", color: "violet", icon: "layers" },
  { name: "Mạng máy tính", slug: "mang-may-tinh", shortName: "Mạng", color: "blue", icon: "network" },
  { name: "Lập trình Web", slug: "lap-trinh-web", shortName: "Web", color: "orange", icon: "code" },
  { name: "Cơ sở dữ liệu", slug: "co-so-du-lieu", shortName: "CSDL", color: "green", icon: "database" },
];

export function currentTimestamp(): number {
  return Date.now();
}

export async function getDeadlines(): Promise<Deadline[]> {
  const contents = await readFile(deadlinesPath, "utf8");
  return JSON.parse(contents) as Deadline[];
}

export async function getDeadline(id: string): Promise<Deadline | undefined> {
  const deadlines = await getDeadlines();
  return deadlines.find((deadline) => deadline.id === id);
}

export async function getSubjectDeadlines(slug: string): Promise<Deadline[]> {
  const deadlines = await getDeadlines();
  return deadlines.filter((deadline) => deadline.subjectSlug === slug);
}

export async function addDeadline(
  deadline: Omit<Deadline, "id" | "createdAt">,
): Promise<Deadline> {
  const deadlines = await getDeadlines();
  const nextDeadline: Deadline = {
    ...deadline,
    id: `${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  await writeFile(deadlinesPath, `${JSON.stringify([nextDeadline, ...deadlines], null, 2)}\n`);
  return nextDeadline;
}

export async function removeDeadline(id: string): Promise<void> {
  const deadlines = await getDeadlines();
  const nextDeadlines = deadlines.filter((deadline) => deadline.id !== id);
  if (nextDeadlines.length === deadlines.length) {
    throw new Error("Không tìm thấy deadline cần xoá.");
  }
  await writeFile(deadlinesPath, `${JSON.stringify(nextDeadlines, null, 2)}\n`);
}

type Progress = Record<string, string[]>;

async function getProgress(): Promise<Progress> {
  const contents = await readFile(progressPath, "utf8");
  return JSON.parse(contents) as Progress;
}

export async function isDeadlineComplete(id: string, email: string): Promise<boolean> {
  const progress = await getProgress();
  return progress[email]?.includes(id) ?? false;
}

export async function markDeadlineComplete(id: string, email: string): Promise<void> {
  const progress = await getProgress();
  const completed = new Set(progress[email] ?? []);
  completed.add(id);
  progress[email] = [...completed];
  await writeFile(progressPath, `${JSON.stringify(progress, null, 2)}\n`);
}
