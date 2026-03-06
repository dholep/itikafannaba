import { notFound } from "next/navigation";
import { getByCode } from "@/lib/storage";
import QRCode from "qrcode";

type Props = { params: { id: string } };

export default async function QrPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();
  const peserta = await getByCode(id);
  if (!peserta) return notFound();
  const payload = { id: peserta.participant_code, nama: peserta.name };
  const dataUrl = await QRCode.toDataURL(JSON.stringify(payload));
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">QR Code Peserta</h1>
      <div className="rounded border border-gray-200 bg-white p-6 flex flex-col items-center gap-4 shadow-sm">
        <img src={dataUrl} alt="QR Peserta" className="bg-white p-2 rounded" />
        <div className="text-center">
          <div className="text-lg font-semibold tracking-wide">
            {peserta.participant_code}
          </div>
          <div className="text-sm text-slate-600">{peserta.name}</div>
        </div>
        <h2>DONASI ITIKAF</h2>
        <img
          src="/qris.png"
          alt="QRIS Masjid An Naba"
          className="w-35 md:w-48 rounded shadow-sm"
        />
      </div>
    </section>
  );
}
