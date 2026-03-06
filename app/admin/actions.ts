 "use server";
import { revalidatePath } from "next/cache";
import { getRegistrationOpen, setRegistrationOpen } from "@/lib/storage";

export async function toggleRegistration() {
  try {
    const current = await getRegistrationOpen();
    await setRegistrationOpen(!current);
    revalidatePath("/admin");
    revalidatePath("/register");
  } catch {}
}
