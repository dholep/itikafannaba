import crypto from "crypto";

const SALT = "itikaf-annaba-captcha.v1";

function sha256Hex(input: string): string {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export function generateCaptcha() {
  const a = Math.floor(3 + Math.random() * 7);
  const b = Math.floor(3 + Math.random() * 7);
  const answer = String(a + b);
  const nonce = crypto.randomBytes(8).toString("hex");
  const hash = sha256Hex(`${SALT}:${answer}:${nonce}`);
  return {
    question: `Berapa ${a} + ${b}?`,
    nonce,
    hash,
  };
}

export function verifyCaptcha(
  answer: string,
  nonce: string,
  expectedHash: string
): boolean {
  const computed = sha256Hex(`${SALT}:${String(answer)}:${nonce}`);
  return computed === expectedHash;
}
