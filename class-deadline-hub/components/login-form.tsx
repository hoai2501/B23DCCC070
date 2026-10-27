import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";

export function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  async function login(formData: FormData) {
    "use server";
    const email = formData.get("email");
    const password = formData.get("password");
    if (typeof email !== "string" || typeof password !== "string" || !email.includes("@") || !password) {
      redirect("/login?error=CredentialsSignin");
    }
    const requestedUrl = formData.get("callbackUrl");
    const redirectTo = typeof requestedUrl === "string" && requestedUrl.startsWith("/") && !requestedUrl.startsWith("//")
      ? requestedUrl
      : "/dashboard";
    try {
      await signIn("credentials", { email, password, redirectTo });
    } catch (error) {
      if (error instanceof AuthError) redirect("/login?error=CredentialsSignin");
      throw error;
    }
  }

  return (
    <form action={login} className="login-form">
      <input type="hidden" name="callbackUrl" value={callbackUrl ?? ""} />
      <label>Email sinh viên<span className="input-wrap"><input name="email" type="email" placeholder="tenban@ptit.edu.vn" autoComplete="email" required /></span></label>
      <label>Mật khẩu<span className="input-wrap"><input name="password" type="password" placeholder="Nhập mật khẩu" autoComplete="current-password" required /></span></label>
      <button className="button button-dark button-full">Đăng nhập <ArrowRight size={16} /></button>
    </form>
  );
}
