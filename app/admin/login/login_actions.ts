 "use server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, expectedSessionToken, isAdminPasswordSet } from "@/lib/auth";
import { redirect } from "next/navigation";

type LoginState = { error?: string };

export async function loginAction(_prev: unknown, formData: FormData): Promise<LoginState> {
  const password = String(formData.get("password") || "");
  if (!isAdminPasswordSet()) {
    return { error: "ADMIN_PASSWORD belum diset di environment" };
  }
  const expected = process.env.ADMIN_PASSWORD!;
  if (password !== expected) {
    return { error: "Password salah" };
  }
  const token = expectedSessionToken();
  cookies().set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    maxAge: 60 * 60 * 12,
  });
  redirect("/admin");
}

export async function logoutAction() {
  cookies().delete(SESSION_COOKIE);
  redirect("/admin/login");
}
