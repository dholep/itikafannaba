import { notFound } from "next/navigation";
import { getByCode } from "@/lib/storage";
import QRCode from "qrcode";
import Image from "next/image";
import Barcode from "../Barcode";

type Props = {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export const dynamic = "force-dynamic";

export default async function QrPage({ params, searchParams }: Props) {
  const { id } = params;
  if (!id) return notFound();
  const code = decodeURIComponent(id).toUpperCase();
  const peserta = await getByCode(code);
  const fallbackName =
    (typeof searchParams?.name === "string" && searchParams?.name) || undefined;
  const payload = peserta
    ? { id: peserta.participant_code, nama: peserta.name }
    : { id: code, nama: fallbackName ?? "Unknown" };
  const dataUrl = await QRCode.toDataURL(payload.id);
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
        <div className="w-full grid gap-2 justify-items-center">
          <div className="text-sm text-slate-600">Barcode</div>
          <Barcode value={payload.id} />
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold tracking-wide">
            {payload.id}
          </div>
          <div className="text-sm text-slate-600">{payload.nama}</div>
        </div>
        <div className="text-center grid gap-2">
          <p className="text-sm text-slate-700">
            Bergabung ke grup WhatsApp peserta untuk mendapatkan informasi resmi
            i’tikaf. Simpan QR Code di atas sebagai bukti pendaftaran.
          </p>
          <a
            href="https://chat.whatsapp.com/FcfJlJVtcyT1jNCrk400Iu"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex justify-center rounded bg-green-600 hover:bg-green-500 px-4 py-2 text-white"
          >
            Masuk Grup WhatsApp
          </a>
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
