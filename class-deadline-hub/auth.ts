import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { Role } from "@/lib/types";

const accounts = [
  { id: "1", name: "Lớp trưởng", email: "admin@ptit.edu.vn", password: "admin123", role: "admin" as const },
  { id: "2", name: "Sinh viên", email: "sv@ptit.edu.vn", password: "sv123456", role: "user" as const },
];

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mật khẩu", type: "password" },
      },
      authorize(credentials) {
        const account = accounts.find(
          (item) =>
            item.email === credentials.email &&
            item.password === credentials.password,
        );
        if (!account) return null;
        return {
          id: account.id,
          name: account.name,
          email: account.email,
          role: account.role satisfies Role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        if (user.id) token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (!token.id || !token.role) {
        throw new Error("Phiên đăng nhập thiếu thông tin id hoặc vai trò.");
      }
      session.user.id = token.id;
      session.user.role = token.role;
      return session;
    },
  },
});
