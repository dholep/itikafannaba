"use client";
import { useMemo, useEffect, useState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { deleteAttendance, updateAttendance } from "./actions";

type Row = {
  id: number;
  participant_code: string;
  participant_name: string;
  date: string;
  night?: number;
  attendees: string[];
};

export default function AdminAttendanceTable({ rows }: { rows: Row[] }) {
  const [date, setDate] = useState<string>("");
  function todayLocal() {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(now.getDate()).padStart(2, "0")}`;
  }
  useEffect(() => {
    setDate(todayLocal());
  }, []);
  const filtered = useMemo(() => {
    if (!date) return rows;
    return rows.filter((x) => x.date === date);
  }, [rows, date]);

  return (
    <div className="space-y-3">
      <div className="flex items-end gap-3">
        <label className="grid gap-2">
          <span className="text-sm">Filter Tanggal</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
          />
        </label>
        <button
          className="rounded bg-gray-200 hover:bg-gray-300 px-3 py-2 text-sm"
          onClick={() => setDate("")}
        >
          Reset
        </button>
      </div>
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
            {filtered.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-center" colSpan={5}>
                  Belum ada data absensi
                </td>
              </tr>
            ) : (
              filtered.map((x) => (
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
                    <div className="text-xs text-slate-600">
                      {x.participant_code}
                    </div>
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
                        <input
                          type="hidden"
                          name="night"
                          value={x.night ?? ""}
                        />
                        <input
                          type="hidden"
                          name="attendees_text"
                          value={x.attendees.join(", ")}
                        />
                        <SaveButton />
                      </form>
                      <form action={deleteAttendance}>
                        <input type="hidden" name="id" value={x.id} />
                        <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-1 text-white">
                          Hapus
                        </button>
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
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  const prev = useRef(false);
  const [saved, setSaved] = useState(false);
  useEffect(() => {
    if (prev.current && !pending) {
      setSaved(true);
      const t = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(t);
    }
    prev.current = pending;
  }, [pending]);
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="submit"
        disabled={pending}
        className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-white disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan"}
      </button>
      {saved && <span className="text-emerald-700 text-sm">Tersimpan</span>}
    </div>
  );
}
