"use server";

import { auth } from "@/auth";
import { addDeadline as saveDeadline, getDeadline, markDeadlineComplete, removeDeadline } from "@/lib/data";
import { can } from "@/lib/permissions";
import { subjects } from "@/lib/data";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { Role } from "@/lib/types";

async function requireAction(action: "completeDeadline" | "addDeadline" | "deleteDeadline") {
  const session = await auth();
  const role: Role = session?.user.role ?? "guest";
  if (!session?.user.email || !can(role, action)) {
    throw new Error("Bạn không có quyền thực hiện thao tác này.");
  }
  return session;
}

export async function completeDeadlineAction(formData: FormData) {
  const session = await requireAction("completeDeadline");
  const id = formData.get("id");
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Mã deadline không hợp lệ.");
  }
  if (!(await getDeadline(id))) {
    throw new Error("Không tìm thấy deadline cần đánh dấu.");
  }
  await markDeadlineComplete(id, session.user.email!);
  revalidatePath("/dashboard");
  revalidatePath(`/deadlines/${id}`);
}

export async function createDeadlineAction(formData: FormData) {
  await requireAction("addDeadline");
  const title = formData.get("title");
  const subjectSlug = formData.get("subjectSlug");
  const description = formData.get("description");
  const dueDate = formData.get("dueDate");
  const type = formData.get("type");
  const priority = formData.get("priority");

  if (
    typeof title !== "string" || title.trim().length < 4 || title.trim().length > 120 ||
    typeof description !== "string" || description.trim().length < 10 || description.trim().length > 1000 ||
    typeof subjectSlug !== "string" || typeof dueDate !== "string" ||
    typeof type !== "string" || type.trim().length < 2 || type.trim().length > 32 ||
    (priority !== "low" && priority !== "medium" && priority !== "high")
  ) {
    throw new Error("Thông tin deadline chưa hợp lệ. Vui lòng kiểm tra lại các trường.");
  }

  const subject = subjects.find((item) => item.slug === subjectSlug);
  const parsedDate = new Date(dueDate);
  if (!subject || Number.isNaN(parsedDate.getTime())) {
    throw new Error("Môn học hoặc ngày hạn chót không hợp lệ.");
  }

  const deadline = await saveDeadline({
    title: title.trim(),
    subject: subject.name,
    subjectSlug: subject.slug,
    description: description.trim(),
    dueDate: parsedDate.toISOString(),
    type: type.trim(),
    priority,
  });
  revalidatePath("/deadlines");
  revalidatePath("/deadlines/[id]", "page");
  revalidatePath("/subjects/[slug]", "page");
  redirect(`/deadlines/${deadline.id}`);
}

export async function deleteDeadlineAction(formData: FormData) {
  await requireAction("deleteDeadline");
  const id = formData.get("id");
  if (typeof id !== "string" || !id.trim()) {
    throw new Error("Mã deadline không hợp lệ.");
  }
  const deadline = await getDeadline(id);
  if (!deadline) {
    throw new Error("Không tìm thấy deadline cần xoá.");
  }
  await removeDeadline(id);
  revalidatePath("/deadlines");
  revalidatePath(`/deadlines/${id}`);
  revalidatePath("/subjects/[slug]", "page");
  redirect("/admin?deleted=1");
}
