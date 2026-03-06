const SALT = "annaba.itikaf.session.v1";

function constTimeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.trim();
  const len = clean.length;
  if (len % 2 !== 0) throw new Error("invalid hex");
  const out = new Uint8Array(len / 2);
  for (let i = 0; i < len; i += 2) {
    out[i / 2] = parseInt(clean.slice(i, i + 2), 16);
  }
  return out;
}

async function sha256Hex(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const digest = await crypto.subtle.digest("SHA-256", data);
  const bytes = new Uint8Array(digest);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function expectedSessionToken(): Promise<string> {
  const secret = process.env.ADMIN_PASSWORD || "";
  return sha256Hex(secret + SALT);
}

export async function verifySessionToken(token?: string): Promise<boolean> {
  if (!token) return false;
  const expected = await expectedSessionToken();
  const a = hexToBytes(token);
  const b = hexToBytes(expected);
  return constTimeEqual(a, b);
}
