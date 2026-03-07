"use client";

import { useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";

type SaveButtonProps = {
  label?: string;
  savingLabel?: string;
  className?: string;
};

export default function SaveButton({
  label = "Simpan",
  savingLabel = "Menyimpan...",
  className = "rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-white disabled:opacity-60",
}: SaveButtonProps) {
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
      <button type="submit" disabled={pending} className={className}>
        {pending ? savingLabel : label}
      </button>
      {saved && <span className="text-emerald-700 text-sm">Tersimpan</span>}
    </div>
  );
}
