"use client";

import { useState } from "react";
import SaveButton from "@/app/components/SaveButton";
import {
  deleteParticipant,
  updateParticipant,
  updateChild,
  deleteChild,
  addChild,
} from "./actions";

type Participant = {
  id: number;
  participant_code: string;
  name: string;
  phone: string;
  address?: string;
};

type Child = {
  id: number;
  participant_id: number;
  name: string;
};

export default function ParticipantRow({
  p,
  childrenData,
}: {
  p: Participant;
  childrenData: Child[];
}) {
  const [name, setName] = useState(p.name);
  const [phone, setPhone] = useState(p.phone);
  const [address, setAddress] = useState(p.address || "");

  const formId = `form-${p.id}`;

  return (
    <>
      <tr key={p.participant_code} className="border-t border-gray-200 align-top">
        <td className="px-3 py-2">{p.participant_code}</td>
        <td className="px-3 py-2">
          <input
            form={formId}
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm w-full"
          />
        </td>
        <td className="px-3 py-2">
          <input
            form={formId}
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm w-full"
          />
        </td>
        <td className="px-3 py-2">
          <textarea
            form={formId}
            name="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={2}
            className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm w-full"
          />
        </td>
        <td className="px-3 py-2">
          <div className="flex gap-2 items-start">
            <form id={formId} action={updateParticipant}>
              <input type="hidden" name="code" value={p.participant_code} />
              <SaveButton />
            </form>
            <form action={deleteParticipant}>
              <input type="hidden" name="code" value={p.participant_code} />
              <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-1 text-white">
                Hapus
              </button>
            </form>
          </div>
        </td>
      </tr>
      <tr className="border-t border-gray-200">
        <td colSpan={5} className="px-3 py-2">
          <div className="text-xs text-slate-600 mb-2">Anak:</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {childrenData.length === 0 ? (
              <div className="text-sm text-slate-500">Belum ada anak</div>
            ) : (
              childrenData.map((c) => (
                <div key={c.id} className="flex items-center gap-2">
                  <form className="flex items-center gap-2 w-full" action={updateChild}>
                    <input type="hidden" name="child_id" value={c.id} />
                    <input
                      name="child_name"
                      defaultValue={c.name}
                      className="flex-1 rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                    />
                    <SaveButton label="Simpan" />
                  </form>
                  <form action={deleteChild}>
                    <input type="hidden" name="child_id" value={c.id} />
                    <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-1 text-white">
                      Hapus
                    </button>
                  </form>
                </div>
              ))
            )}
            <form className="flex items-center gap-2 mt-2" action={addChild}>
              <input type="hidden" name="code" value={p.participant_code} />
              <input
                name="child_name"
                placeholder="Nama anak baru"
                className="flex-1 rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
              />
              <SaveButton label="Tambah" savingLabel="Menambah..." className="rounded bg-blue-600 hover:bg-blue-500 px-3 py-1 text-white disabled:opacity-60" />
            </form>
          </div>
        </td>
      </tr>
    </>
  );
}
