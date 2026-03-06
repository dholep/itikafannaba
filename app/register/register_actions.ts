"use server";
import {
  addParticipant,
  getByPhone,
  addChildrenForParticipant,
  getRegistrationOpen,
} from "@/lib/storage";
import { verifyCaptcha } from "@/lib/captcha";

type ActionState = { error: string } | { success: true; code: string };

export async function registerParticipant(
  _prevState: unknown,
  formData: FormData
): Promise<ActionState> {
  const open = await getRegistrationOpen();
  if (!open) return { error: "Pendaftaran sudah ditutup" };
  const phone = String(formData.get("phone") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const address = String(formData.get("address") || "").trim();
  const children = formData
    .getAll("children")
    .map((c) => String(c || "").trim())
    .filter(Boolean);
  const captchaAnswer = String(formData.get("captchaAnswer") || "").trim();
  const captchaNonce = String(formData.get("captchaNonce") || "").trim();
  const captchaHash = String(formData.get("captchaHash") || "").trim();

  if (!phone) return { error: "Nomor HP wajib diisi" };
  if (!name) return { error: "Nama wajib diisi" };
  if (!verifyCaptcha(captchaAnswer, captchaNonce, captchaHash)) {
    return { error: "Captcha salah" };
  }

  const exists = await getByPhone(phone);
  if (exists) return { error: "Nomor HP sudah terdaftar" };

  const saved = await addParticipant({ phone, name, address });
  if (children.length > 0) {
    await addChildrenForParticipant(saved.id, children);
  }
  return { success: true, code: saved.participant_code };
}
