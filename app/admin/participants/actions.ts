"use server";
import { revalidatePath } from "next/cache";
import {
  deleteParticipantByCode,
  updateParticipantByCode,
  updateChildName,
  deleteChildById,
  addChildrenForParticipant,
  getByCode,
} from "@/lib/storage";

export async function deleteParticipant(formData: FormData) {
  try {
    const code = String(formData.get("code") || "");
    if (!code) return;
    await deleteParticipantByCode(code);
    revalidatePath("/admin/participants");
  } catch {}
}

export async function updateParticipant(formData: FormData) {
  try {
    const code = String(formData.get("code") || "");
    const name = String(formData.get("name") || "");
    const phone = String(formData.get("phone") || "");
    const address = String(formData.get("address") || "");
    if (!code) return;
    await updateParticipantByCode(code, { name, phone, address });
    revalidatePath("/admin/participants");
  } catch {}
}

export async function updateChild(formData: FormData) {
  try {
    const id = Number(formData.get("child_id") || 0);
    const name = String(formData.get("child_name") || "");
    if (!id || !name.trim()) return;
    await updateChildName(id, name);
    revalidatePath("/admin/participants");
  } catch {}
}

export async function deleteChild(formData: FormData) {
  try {
    const id = Number(formData.get("child_id") || 0);
    if (!id) return;
    await deleteChildById(id);
    revalidatePath("/admin/participants");
  } catch {}
}

export async function addChild(formData: FormData) {
  try {
    const code = String(formData.get("code") || "");
    const name = String(formData.get("child_name") || "");
    if (!code || !name.trim()) return;
    const p = await getByCode(code);
    if (!p) return;
    await addChildrenForParticipant(p.id, [name]);
    revalidatePath("/admin/participants");
  } catch {}
}
