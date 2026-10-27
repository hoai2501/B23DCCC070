export type Role = "guest" | "user" | "admin";

export type Action =
  | "viewDeadline"
  | "completeDeadline"
  | "addDeadline"
  | "deleteDeadline";

export type Deadline = {
  id: string;
  title: string;
  subject: string;
  subjectSlug: string;
  description: string;
  dueDate: string;
  type: string;
  priority: "low" | "medium" | "high";
  createdAt: string;
};

export type Subject = {
  name: string;
  slug: string;
  shortName: string;
  color: string;
  icon: string;
};
