import { readParticipants, getChildrenByParticipantId } from "@/lib/storage";
import ParticipantRow from "./ParticipantRow";

export const dynamic = "force-dynamic";

export default async function AdminParticipants() {
  const items = await readParticipants();
  const usingNeon = !!process.env.DATABASE_URL;
  const childrenEntries = await Promise.all(
    items.map(
      async (p) => [p.id, await getChildrenByParticipantId(p.id)] as const
    )
  );
  const childrenById = Object.fromEntries(childrenEntries) as Record<
    number,
    { id: number; participant_id: number; name: string }[]
  >;
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">Manajemen Peserta</h1>
      <p className="text-slate-700">Tabel peserta dari storage.</p>
      {!usingNeon && (
        <div className="rounded border border-yellow-600 bg-yellow-50 text-yellow-800 px-3 py-2">
          Mode file lokal aktif. Tambahkan DATABASE_URL agar membaca Neon DB.
        </div>
      )}
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
                <td className="px-3 py-4 text-center" colSpan={5}>
                  Belum ada peserta
                </td>
              </tr>
            ) : (
              items.map((p) => {
                const children = childrenById[p.id] ?? [];
                return (
                  <ParticipantRow
                    key={p.participant_code}
                    p={p}
                    childrenData={children}
                  />
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
