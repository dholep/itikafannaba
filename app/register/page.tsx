import RegisterForm from "./RegisterForm";
import { generateCaptcha } from "@/lib/captcha";
import { getRegistrationOpen } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const open = await getRegistrationOpen();
  const captcha = generateCaptcha();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Form Pendaftaran Peserta</h1>
      {!open && (
        <div className="rounded border border-yellow-600 bg-yellow-50 text-yellow-800 px-3 py-2">
          Pendaftaran sudah ditutup.
        </div>
      )}
      <p className="text-slate-700">
        Isi Nomor HP, Nama, dan Alamat. Pilihan malam, sahur/berbuka, serta anak
        akan ditambahkan berikutnya.
      </p>
      {open && <RegisterForm captcha={captcha} />}
    </section>
  );
}
