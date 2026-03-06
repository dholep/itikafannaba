import { redirect } from "next/navigation";

type Props = { searchParams?: { [key: string]: string | string[] | undefined } };

export default function QrIndex({ searchParams }: Props) {
  const code =
    typeof searchParams?.code === "string" ? searchParams.code : undefined;
  if (code && code.trim()) {
    const target = `/qr/${encodeURIComponent(code.trim())}`;
    redirect(target);
  }
  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold">QR Code Peserta</h1>
      <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-slate-700">
          Halaman QR membutuhkan kode peserta di URL, misalnya:
        </p>
        <pre className="mt-2 rounded bg-gray-100 p-3 text-sm">
          /qr/ITIKAF-001
        </pre>
        <p className="mt-2 text-sm text-slate-600">
          Atau gunakan query <code>?code=ITIKAF-001</code> untuk diarahkan
          otomatis.
        </p>
      </div>
    </section>
  );
}
