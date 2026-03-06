import crypto from "crypto";

export const SESSION_COOKIE = "admin_session";
const SALT = "annaba.itikaf.session.v1";

function sha256(input: string) {
  return crypto.createHash("sha256").update(input).digest();
}

export function expectedSessionToken(): string {
  const secret = process.env.ADMIN_PASSWORD || "";
  return crypto
    .createHash("sha256")
    .update(secret + SALT)
    .digest("hex");
}

function constTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const expected = expectedSessionToken();
  const a = Uint8Array.from(Buffer.from(token, "hex"));
  const b = Uint8Array.from(Buffer.from(expected, "hex"));
  return constTimeEqual(a, b);
}

export function isAdminPasswordSet(): boolean {
  return (
    !!process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 12
  );
}
