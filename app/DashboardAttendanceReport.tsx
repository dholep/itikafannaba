"use client";
import { useMemo, useRef, useEffect, useState } from "react";

type AttendanceItem = {
  id: number;
  participant_code: string;
  participant_name: string;
  date: string;
  night?: number;
  attendees: string[];
};

export default function DashboardAttendanceReport({
  items,
}: {
  items: AttendanceItem[];
}) {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const filtered = useMemo(() => {
    if (!date) return items;
    return items.filter((x) => x.date === date);
  }, [items, date]);
  const listRef = useRef<HTMLTableSectionElement | null>(null);
  const [distance, setDistance] = useState<number>(0);
  const [duration, setDuration] = useState<number>(20);
  useEffect(() => {
    if (!listRef.current || filtered.length === 0) return;
    const h = listRef.current.offsetHeight;
    setDistance(h);
    const pxPerSec = 40;
    setDuration(Math.max(10, Math.round(h / pxPerSec)));
  }, [filtered]);

  return (
    <div className="grid gap-4">
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

      <div className="rounded border border-gray-200 bg-white shadow-sm max-w-4xl">
        {filtered.length === 0 ? (
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-3 py-2 text-left">No.</th>
                <th className="px-3 py-2 text-left">Tanggal</th>
                <th className="px-3 py-2 text-left">Malam</th>
                <th className="px-3 py-2 text-left">Peserta</th>
                <th className="px-3 py-2 text-left">Hadir</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-4 text-center" colSpan={5}>
                  Tidak ada data absensi
                </td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="viewport">
            <table className="w-full table-fixed text-xs">
              <colgroup>
                <col style={{ width: "8%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "10%" }} />
                <col style={{ width: "32%" }} />
                <col style={{ width: "30%" }} />
              </colgroup>
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 text-left">No.</th>
                  <th className="px-3 py-2 text-left">Tanggal</th>
                  <th className="px-3 py-2 text-left">Malam</th>
                  <th className="px-3 py-2 text-left">Peserta</th>
                  <th className="px-3 py-2 text-left">Hadir</th>
                </tr>
              </thead>
            </table>
            <div
              className="track"
              style={{
                ["--distance" as any]: `${distance}px`,
                ["--duration" as any]: `${duration}s`,
              }}
            >
              <table className="w-full table-fixed text-xs">
                <colgroup>
                  <col style={{ width: "8%" }} />
                  <col style={{ width: "20%" }} />
                  <col style={{ width: "10%" }} />
                  <col style={{ width: "32%" }} />
                  <col style={{ width: "30%" }} />
                </colgroup>
                <tbody ref={listRef}>
                  {filtered.map((x, idx) => (
                    <tr
                      key={x.id}
                      className="border-t border-gray-200 align-top"
                    >
                      <td className="px-2 py-1">{idx + 1}</td>
                      <td className="px-2 py-1">{x.date}</td>
                      <td className="px-2 py-1">{x.night ?? "-"}</td>
                      <td className="px-2 py-1">
                        <div className="font-medium">{x.participant_name}</div>
                        <div className="text-xs text-slate-600">
                          {x.participant_code}
                        </div>
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex flex-wrap gap-1">
                          {x.attendees.map((n, i) => (
                            <span
                              key={i}
                              className="rounded bg-gray-100 px-2 py-0.5"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tbody aria-hidden="true">
                  {filtered.map((x, i) => (
                    <tr
                      key={`dup-${x.id}-${i}`}
                      className="border-t border-gray-200 align-top"
                    >
                      <td className="px-2 py-1">{i + 1}</td>
                      <td className="px-2 py-1">{x.date}</td>
                      <td className="px-2 py-1">{x.night ?? "-"}</td>
                      <td className="px-2 py-1">
                        <div className="font-medium">{x.participant_name}</div>
                        <div className="text-xs text-slate-600">
                          {x.participant_code}
                        </div>
                      </td>
                      <td className="px-2 py-1">
                        <div className="flex flex-wrap gap-1">
                          {x.attendees.map((n, j) => (
                            <span
                              key={j}
                              className="rounded bg-gray-100 px-2 py-0.5"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        .viewport {
          height: 12rem;
          overflow: hidden;
          position: relative;
        }
        .track {
          animation: marqueeUp var(--duration) linear infinite;
        }
        @keyframes marqueeUp {
          from {
            transform: translateY(0);
          }
          to {
            transform: translateY(calc(var(--distance) * -1));
          }
        }
      `}</style>
    </div>
  );
}
