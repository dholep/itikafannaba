"use client";
import { useFormState } from "react-dom";
import { lookupParticipant, saveAttendance } from "./actions";
import { useMemo, useState } from "react";

const initialLookup: any = null;

export default function AttendanceWidget() {
  const [lookupState, lookupAction] = useFormState(
    lookupParticipant,
    initialLookup
  );
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [saveMsg, setSaveMsg] = useState<string | null>(null);

  const names = useMemo(() => {
    if (!lookupState?.success) return [];
    const arr = [
      lookupState.participant.name,
      ...lookupState.children.map((c: any) => c.name),
    ];
    return arr;
  }, [lookupState]);

  const count = useMemo(
    () => Object.values(selected).filter(Boolean).length,
    [selected]
  );

  return (
    <div className="grid gap-4">
      <form className="grid gap-3 max-w-md" action={lookupAction}>
        <label className="grid gap-2">
          <span className="text-sm">ID Peserta</span>
          <input
            name="code"
            placeholder="ITIKAF-001"
            className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
          />
        </label>
        <button className="rounded bg-blue-600 hover:bg-blue-500 px-3 py-2 text-white">
          Cari
        </button>
      </form>

      {lookupState?.error && (
        <div className="rounded border border-red-700 bg-red-900/20 text-red-700 px-3 py-2">
          {lookupState.error}
        </div>
      )}

      {lookupState?.success && (
        <div className="grid gap-3">
          <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
            <div className="text-sm text-slate-600">Peserta</div>
            <div className="font-medium">
              {lookupState.participant.name} ({lookupState.participant.code})
            </div>
          </div>

          <div className="rounded border border-gray-200 bg-white p-3 shadow-sm">
            <div className="text-sm text-slate-600 mb-2">Pilih yang hadir</div>
            <div className="grid gap-2">
              {names.map((n: string) => (
                <label key={n} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={!!selected[n]}
                    onChange={(e) =>
                      setSelected((s) => ({ ...s, [n]: e.target.checked }))
                    }
                  />
                  <span>{n}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid gap-2 max-w-md">
            <label className="grid gap-2">
              <span className="text-sm">Tanggal</span>
              <input
                type="date"
                name="date_input"
                className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm">Malam (opsional)</span>
              <input
                type="number"
                name="night_input"
                min={21}
                max={30}
                className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm">
              Total hadir: <span className="font-semibold">{count}</span>
            </div>
            <form
              action={async (fd) => {
                fd.set("participant_id", String(lookupState.participant.id));
                const dateEl = document.querySelector(
                  'input[name="date_input"]'
                ) as HTMLInputElement | null;
                const nightEl = document.querySelector(
                  'input[name="night_input"]'
                ) as HTMLInputElement | null;
                if (dateEl?.value) fd.set("date", dateEl.value);
                if (nightEl?.value) fd.set("night", nightEl.value);
                names.forEach((n) => {
                  if (selected[n]) fd.append("attendees", n);
                });
                const res = await saveAttendance(fd);
                if (res?.success) {
                  setSaveMsg(`Berhasil menyimpan absensi (${res.count} hadir)`);
                  setSelected({});
                } else if (res?.error) {
                  setSaveMsg(res.error);
                } else {
                  setSaveMsg("Tidak ada respon dari server");
                }
              }}
            >
              <button
                className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-2 text-white"
                disabled={count === 0}
              >
                Simpan Absensi
              </button>
            </form>
          </div>
          {saveMsg && (
            <div className="rounded border border-gray-300 bg-white px-3 py-2 text-sm">
              {saveMsg}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
