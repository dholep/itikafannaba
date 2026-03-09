"use client";

import { useEffect, useMemo, useState } from "react";

type Attendance = { date: string; attendees: string[] };

export default function AttendanceCountCard({
  attendance,
}: {
  attendance: Attendance[];
}) {
  const [date, setDate] = useState<string>("");
  useEffect(() => {
    const wibNow = new Date(Date.now() + 7 * 60 * 60 * 1000);
    const today = `${wibNow.getUTCFullYear()}-${String(
      wibNow.getUTCMonth() + 1
    ).padStart(2, "0")}-${String(wibNow.getUTCDate()).padStart(2, "0")}`;
    setDate(today);
  }, []);

  const count = useMemo(() => {
    if (!date) return 0;
    return attendance
      .filter((a) => a.date === date)
      .reduce((acc, a) => acc + a.attendees.length, 0);
  }, [attendance, date]);

  return (
    <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm text-slate-600">Total Hadir</div>
          <div className="text-2xl font-bold">{count}</div>
        </div>
        <label className="grid gap-1">
          <span className="text-xs text-slate-600">Tanggal</span>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="rounded bg-white border border-gray-300 px-2 py-1 text-sm shadow-sm"
          />
        </label>
      </div>
    </div>
  );
}
