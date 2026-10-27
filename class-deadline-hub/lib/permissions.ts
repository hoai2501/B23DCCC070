import type { Action, Role } from "@/lib/types";

const permissions: Record<Role, readonly Action[]> = {
  guest: ["viewDeadline"],
  user: ["viewDeadline", "completeDeadline"],
  admin: ["viewDeadline", "completeDeadline", "addDeadline", "deleteDeadline"],
};

export function can(role: Role, action: Action): boolean {
  return permissions[role].includes(action);
}
