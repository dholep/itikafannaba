"use server";
import { revalidatePath } from "next/cache";
import {
  getByCode,
  getById,
  getChildrenByParticipantId,
  addAttendanceRecord,
  updateAttendanceRecord,
  deleteAttendanceRecordById,
} from "@/lib/storage";

export async function lookupParticipant(
  _prevState: unknown,
  formData: FormData
) {
  try {
    const code = String(formData.get("code") || "").trim();
    if (!code) return { error: "ID Peserta wajib diisi" };
    let p = await getByCode(code);
    if (!p) {
      const num = Number(code);
      if (!Number.isNaN(num) && num > 0) {
        p = await getById(num);
      }
    }
    if (!p) return { error: "Peserta tidak ditemukan" };
    const children = await getChildrenByParticipantId(p.id);
    return {
      success: true,
      participant: { id: p.id, code: p.participant_code, name: p.name },
      children,
    };
  } catch (e: any) {
    return { error: "Terjadi kesalahan" };
  }
}

export async function saveAttendance(formData: FormData) {
  try {
    const participant_id = Number(formData.get("participant_id") || 0);
    const night = Number(formData.get("night") || 0);
    const date =
      String(formData.get("date") || "") ||
      `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
        2,
        "0"
      )}-${String(new Date().getDate()).padStart(2, "0")}`;
    const attendees = formData.getAll("attendees").map((x) => String(x));
    if (!participant_id || attendees.length === 0) {
      return { error: "Data tidak lengkap" };
    }
    await addAttendanceRecord(
      participant_id,
      date,
      attendees,
      isNaN(night) ? undefined : night
    );
    revalidatePath("/admin/attendance");
    return { success: true, count: attendees.length };
  } catch {
    return { error: "Gagal menyimpan absensi" };
  }
}

export async function updateAttendance(formData: FormData) {
  try {
    const id = Number(formData.get("id") || 0);
    const date = String(formData.get("date") || "");
    const night = Number(formData.get("night") || 0);
    const attendees_text = String(formData.get("attendees_text") || "");
    if (!id) return;
    const attendees = attendees_text
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    await updateAttendanceRecord(id, {
      date: date || undefined,
      night: isNaN(night) ? undefined : night,
      attendees: attendees.length ? attendees : undefined,
    });
    revalidatePath("/admin/attendance");
  } catch {}
}

export async function deleteAttendance(formData: FormData) {
  try {
    const id = Number(formData.get("id") || 0);
    if (!id) return;
    await deleteAttendanceRecordById(id);
    revalidatePath("/admin/attendance");
  } catch {}
}
