import AttendanceWidget from "./AttendanceWidget";
import { readAttendance, getById } from "@/lib/storage";
import { deleteAttendance, updateAttendance } from "./actions";

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

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Data Absensi</h2>
        <div className="rounded border border-gray-200 bg-white shadow-sm overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">Tanggal</th>
                <th className="px-3 py-2 text-left">Malam</th>
                <th className="px-3 py-2 text-left">Peserta</th>
                <th className="px-3 py-2 text-left">Hadir</th>
                <th className="px-3 py-2 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr>
                  <td className="px-3 py-4 text-center" colSpan={5}>
                    Belum ada data absensi
                  </td>
                </tr>
              ) : (
                rows.map((x) => (
                  <tr key={x.id} className="border-t border-gray-200 align-top">
                    <td className="px-3 py-2">
                      <form className="grid gap-2" action={updateAttendance}>
                        <input type="hidden" name="id" value={x.id} />
                        <input
                          name="date"
                          defaultValue={x.date}
                          className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                        />
                      </form>
                    </td>
                    <td className="px-3 py-2">
                      <form className="grid gap-2" action={updateAttendance}>
                        <input type="hidden" name="id" value={x.id} />
                        <input
                          type="number"
                          name="night"
                          defaultValue={x.night ?? ""}
                          className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                        />
                      </form>
                    </td>
                    <td className="px-3 py-2">
                      <div className="font-medium">{x.participant_name}</div>
                      <div className="text-xs text-slate-600">{x.participant_code}</div>
                    </td>
                    <td className="px-3 py-2">
                      <form className="grid gap-2" action={updateAttendance}>
                        <input type="hidden" name="id" value={x.id} />
                        <textarea
                          name="attendees_text"
                          defaultValue={x.attendees.join(", ")}
                          rows={2}
                          className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                        />
                      </form>
                    </td>
                    <td className="px-3 py-2">
                      <div className="flex gap-2">
                        <form action={updateAttendance}>
                          <input type="hidden" name="id" value={x.id} />
                          <input type="hidden" name="date" value={x.date} />
                          <input type="hidden" name="night" value={x.night ?? ""} />
                          <input type="hidden" name="attendees_text" value={x.attendees.join(", ")} />
                          <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-white">Simpan</button>
                        </form>
                        <form action={deleteAttendance}>
                          <input type="hidden" name="id" value={x.id} />
                          <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-1 text-white">Hapus</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
