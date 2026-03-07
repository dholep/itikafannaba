import AttendanceWidget from "./AttendanceWidget";
import { readAttendance, getById } from "@/lib/storage";
import { deleteAttendance, updateAttendance } from "./actions";
import AdminAttendanceTable from "./AdminAttendanceTable";

export default async function AdminAttendance() {
  const items = await readAttendance();
  const rows = await Promise.all(
    items.map(async (a) => {
      const p = await getById(a.participant_id);
      return {
        id: a.id,
        participant_code: p?.participant_code || `#${a.participant_id}`,
        participant_name: p?.name || "Unknown",
        date: a.date,
        night: a.night,
        attendees: a.attendees,
      };
    })
  );
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Absensi Admin</h1>
      <p className="text-slate-700">
        Masukkan ID Peserta untuk menampilkan nama peserta dan anak-anaknya, centang yang hadir lalu simpan.
      </p>
      <AttendanceWidget />

      <h2 className="text-xl font-semibold">Data Absensi</h2>
      <AdminAttendanceTable rows={rows} />
    </section>
  );
}
