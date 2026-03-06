import { notFound } from "next/navigation";
import { getByCode } from "@/lib/storage";
import QRCode from "qrcode";
import Image from "next/image";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function QrPage({ params }: Props) {
  const { id } = params;
  if (!id) return notFound();
  const code = decodeURIComponent(id).toUpperCase();
  const peserta = await getByCode(code);
  if (!peserta) return notFound();
  const payload = { id: peserta.participant_code, nama: peserta.name };
  const dataUrl = await QRCode.toDataURL(JSON.stringify(payload));
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">QR Code Peserta</h1>
      <div className="rounded border border-gray-200 bg-white p-6 flex flex-col items-center gap-4 shadow-sm">
        <Image
          src={dataUrl}
          alt="QR Peserta"
          width={256}
          height={256}
          unoptimized
          className="bg-white p-2 rounded"
        />
        <div className="text-center">
          <div className="text-lg font-semibold tracking-wide">
            {payload.id}
          </div>
          <div className="text-sm text-slate-600">{payload.nama}</div>
        </div>
        <h2>DONASI ITIKAF</h2>
        <Image
          src="/qris.png"
          alt="QRIS Masjid An Naba"
          width={192}
          height={260}
          className="rounded shadow-sm"
        />
      </div>
    </section>
  );
}
