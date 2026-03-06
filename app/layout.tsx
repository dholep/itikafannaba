import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "I'tikaf Masjid An-Naba'",
  description: "Pendaftaran I'tikaf dan Panel Admin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen">
        <main className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-xs text-slate-500">
          © {new Date().getFullYear()} Masjid An‑Naba&#39;
        </footer>
      </body>
    </html>
  );
}
