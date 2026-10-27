import { auth } from "@/auth";
import { getDeadline, isDeadlineComplete } from "@/lib/data";
import { can } from "@/lib/permissions";
import type { Role } from "@/lib/types";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!(await getDeadline(id))) {
    return NextResponse.json({ error: "Không tìm thấy deadline." }, { status: 404 });
  }
  const session = await auth();
  const role: Role = session?.user.role ?? "guest";
  if (!session?.user.email || !can(role, "completeDeadline")) {
    return NextResponse.json({ completed: false });
  }
  const completed = await isDeadlineComplete(id, session.user.email);
  return NextResponse.json({ completed });
}
