import { readParticipants, getChildrenByParticipantId } from "@/lib/storage";
import { deleteParticipant, updateParticipant, updateChild, deleteChild, addChild } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminParticipants() {
  const items = await readParticipants();
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Manajemen Peserta</h1>
      <p className="text-slate-700">Tabel peserta dari storage.</p>
      <div className="overflow-x-auto rounded border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-3 py-2 text-left">ID</th>
              <th className="px-3 py-2 text-left">Nama</th>
              <th className="px-3 py-2 text-left">HP</th>
              <th className="px-3 py-2 text-left">Alamat</th>
              <th className="px-3 py-2 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td className="px-3 py-4 text-center" colSpan={5}>Belum ada peserta</td>
              </tr>
            ) : (
              items.map(async (p) => {
                const children = await getChildrenByParticipantId(p.id);
                return (
                  <>
                    <tr key={p.participant_code} className="border-t border-gray-200 align-top">
                      <td className="px-3 py-2">{p.participant_code}</td>
                      <td className="px-3 py-2">
                        <form className="grid gap-2" action={updateParticipant}>
                          <input type="hidden" name="code" value={p.participant_code} />
                          <input
                            name="name"
                            defaultValue={p.name}
                            className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                          />
                      </form>
                      </td>
                      <td className="px-3 py-2">
                        <form className="grid gap-2" action={updateParticipant}>
                          <input type="hidden" name="code" value={p.participant_code} />
                          <input
                            name="phone"
                            defaultValue={p.phone}
                            className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                          />
                        </form>
                      </td>
                      <td className="px-3 py-2">
                        <form className="grid gap-2" action={updateParticipant}>
                          <input type="hidden" name="code" value={p.participant_code} />
                          <textarea
                            name="address"
                            defaultValue={p.address}
                            rows={2}
                            className="rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                          />
                        </form>
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <form action={updateParticipant}>
                            <input type="hidden" name="code" value={p.participant_code} />
                            <input type="hidden" name="name" value={p.name} />
                            <input type="hidden" name="phone" value={p.phone} />
                            <input type="hidden" name="address" value={p.address || ""} />
                            <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-white">Simpan</button>
                          </form>
                          <form action={deleteParticipant}>
                            <input type="hidden" name="code" value={p.participant_code} />
                            <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-1 text-white">Hapus</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                    <tr className="border-t border-gray-200">
                      <td colSpan={5} className="px-3 py-2">
                        <div className="text-xs text-slate-600 mb-2">Anak:</div>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {children.length === 0 ? (
                            <div className="text-sm text-slate-500">Belum ada anak</div>
                          ) : (
                            children.map((c) => (
                              <div key={c.id} className="flex items-center gap-2">
                                <form className="flex items-center gap-2" action={updateChild}>
                                  <input type="hidden" name="child_id" value={c.id} />
                                  <input
                                    name="child_name"
                                    defaultValue={c.name}
                                    className="flex-1 rounded bg-white border border-gray-300 px-2 py-1 shadow-sm"
                                  />
                                  <button className="rounded bg-emerald-600 hover:bg-emerald-500 px-3 py-1 text-white">Simpan</button>
                                </form>
                                <form action={deleteChild}>
                                  <input type="hidden" name="child_id" value={c.id} />
                                  <button className="rounded bg-red-600 hover:bg-red-500 px-3 py-1 text-white">Hapus</button>
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
                            <button className="rounded bg-blue-600 hover:bg-blue-500 px-3 py-1 text-white">Tambah</button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  </>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
