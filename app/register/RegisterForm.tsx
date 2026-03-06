"use client";
import { useFormState } from "react-dom";
import { useState } from "react";
import { registerParticipant } from "./register_actions";
import Image from "next/image";

const initialState: any = null;

type Props = {
  captcha: { question: string; nonce: string; hash: string };
};

export default function RegisterForm({ captcha }: Props) {
  const [state, formAction] = useFormState(registerParticipant, initialState);
  const [childCount, setChildCount] = useState(0);
  const [nameValue, setNameValue] = useState("");

  if (state?.success && state.code) {
    if (typeof window !== "undefined") {
      const q = new URLSearchParams({ name: nameValue }).toString();
      window.location.href = `/qr/${state.code}?${q}`;
    }
  }

  return (
    <form className="grid gap-4 max-w-xl" action={formAction}>
      {state?.error && (
        <div className="rounded border border-red-700 bg-red-900/40 text-red-200 px-3 py-2">
          {state.error}
        </div>
      )}
      <label className="grid gap-2">
        <span className="text-sm">Nomor HP</span>
        <input
          name="phone"
          required
          className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm">Nama</span>
        <input
          name="name"
          required
          onChange={(e) => setNameValue(e.target.value)}
          className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
        />
      </label>
      <label className="grid gap-2">
        <span className="text-sm">Alamat</span>
        <textarea
          name="address"
          className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
          rows={3}
        />
      </label>
      <div className="grid gap-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Anak (opsional)</span>
          <button
            type="button"
            className="rounded bg-slate-700 hover:bg-slate-600 px-3 py-1 text-sm"
            onClick={() => setChildCount((c) => Math.min(c + 1, 8))}
          >
            Tambah Anak
          </button>
        </div>
        {Array.from({ length: childCount }).map((_, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input
              name="children"
              placeholder={`Nama Anak ${idx + 1}`}
              className="flex-1 rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
            />
            <button
              type="button"
              className="rounded bg-red-700 hover:bg-red-600 px-2 py-1 text-sm"
              onClick={() => setChildCount((c) => Math.max(c - 1, 0))}
              aria-label="Hapus anak terakhir"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
      <div className="grid gap-2">
        <span className="text-sm font-medium">Captcha</span>
        <div className="flex gap-2">
          <span className="px-3 py-2 rounded bg-white border border-gray-300 shadow-sm">
            {captcha.question}
          </span>
          <input
            name="captchaAnswer"
            placeholder="Jawaban"
            required
            className="rounded bg-white border border-gray-300 px-3 py-2 shadow-sm"
          />
          <input type="hidden" name="captchaNonce" value={captcha.nonce} />
          <input type="hidden" name="captchaHash" value={captcha.hash} />
        </div>
      </div>
      <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-4 py-2 text-white">
        Daftar
      </button>

      <div className="flex justify-end">
        <Image
          src="/qris.png"
          alt="QRIS Masjid An Naba"
          width={192}
          height={260}
          className="rounded shadow-sm"
        />
      </div>
    </form>
  );
}
