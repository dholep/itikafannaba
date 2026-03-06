import {
  readParticipants,
  readChildren,
  readAttendance,
  getById,
} from "@/lib/storage";
import DashboardAttendanceReport from "./DashboardAttendanceReport";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const participants = await readParticipants();
  const children = await readChildren();
  const totalPeople = participants.length + children.length;
  const attendance = await readAttendance();
  const wibNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
  const today = `${wibNow.getUTCFullYear()}-${String(wibNow.getUTCMonth() + 1).padStart(
    2,
    "0"
  )}-${String(wibNow.getUTCDate()).padStart(2, "0")}`;
  let todayCount = attendance
    .filter((a) => a.date === today)
    .reduce((acc, a) => acc + a.attendees.length, 0);
  if (todayCount === 0 && attendance.length > 0) {
    const latestDate = attendance.reduce((m, a) => (a.date > m ? a.date : m), attendance[0].date);
    todayCount = attendance
      .filter((a) => a.date === latestDate)
      .reduce((acc, a) => acc + a.attendees.length, 0);
  }

  const items = await Promise.all(
    attendance.map(async (a) => {
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
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold">Dashboard Publik</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
          <div className="text-sm text-slate-600">Total Peserta + Anak</div>
          <div className="text-2xl font-bold">{totalPeople}</div>
        </div>
        <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
          <div className="text-sm text-slate-600">Total Hadir Hari Ini</div>
          <div className="text-2xl font-bold">{todayCount}</div>
        </div>
        <div className="justify-self-end mt-2"></div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
        <div className="md:col-span-2 space-y-2">
          <h2 className="text-xl font-semibold">Laporan Absensi</h2>
          <DashboardAttendanceReport items={items} />
        </div>
        <aside className="justify-self-end md:sticky md:top-4">
          <Image
            src="/qris.png"
            alt="QRIS Masjid An Naba"
            width={192}
            height={260}
            className="rounded shadow-sm"
          />
        </aside>
      </div>
    </section>
  );
}
