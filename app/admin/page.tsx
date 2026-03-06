import Link from "next/link";
import { logoutAction } from "./login/login_actions";
import { getRegistrationOpen } from "@/lib/storage";
import { toggleRegistration } from "./actions";

export default async function AdminHome() {
  const open = await getRegistrationOpen();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Admin Panel</h1>
      <p className="text-slate-700">Pilih fitur:</p>
      <div className="flex flex-wrap gap-3">
        <Link
          className="rounded border border-gray-300 bg-white px-4 py-2 shadow-sm"
          href="/admin/participants"
        >
          Manajemen Peserta
        </Link>
        <Link
          className="rounded border border-gray-300 bg-white px-4 py-2 shadow-sm"
          href="/admin/attendance"
        >
          Absensi
        </Link>
      </div>
      <div className="rounded border border-gray-200 bg-white p-4 shadow-sm max-w-md">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-600">Status Pendaftaran</div>
            <div className="font-medium">
              {open ? "ON (dibuka)" : "OFF (ditutup)"}
            </div>
          </div>
          <form action={toggleRegistration}>
            <button className="rounded bg-blue-600 hover:bg-blue-500 px-4 py-2 text-white">
              {open ? "Matikan" : "Nyalakan"}
            </button>
          </form>
        </div>
      </div>
      <form action={logoutAction}>
        <button className="rounded bg-slate-700 hover:bg-slate-600 px-4 py-2 text-white">
          Logout
        </button>
      </form>
    </section>
  );
}
