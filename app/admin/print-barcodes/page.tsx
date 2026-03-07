import { readParticipants } from "@/lib/storage";
import Barcode from "@/app/qr/Barcode";
import PrintButton from "./PrintButton";

export const dynamic = "force-dynamic";

export default async function PrintBarcodesPage() {
  const participants = await readParticipants();

  // Sort by participant code or name
  participants.sort((a, b) =>
    a.participant_code.localeCompare(b.participant_code)
  );

  return (
    <section className="bg-white min-h-screen p-8 text-black print:p-0">
      <div className="mb-8 print:hidden flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cetak Barcode Peserta</h1>
        <PrintButton />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 print:grid-cols-2 print:gap-4">
        {participants.map((p) => (
          <div
            key={p.id}
            className="border border-gray-300 rounded p-4 flex flex-col items-center text-center break-inside-avoid page-break-inside-avoid"
          >
            <div className="text-xl font-bold mb-1">{p.participant_code}</div>
            <div className="text-lg mb-2 line-clamp-2 h-14 leading-tight flex items-center justify-center">
              {p.name}
            </div>
            <div className="w-full flex justify-center bg-white">
              <Barcode value={p.participant_code} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          @page {
            margin: 1cm;
          }
          body {
            background: white;
          }
          .print\\:hidden {
            display: none;
          }
          .print\\:grid-cols-2 {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
          .print\\:gap-4 {
            gap: 1rem;
          }
          .page-break-inside-avoid {
            page-break-inside: avoid;
          }
        }
      `}</style>
    </section>
  );
}
