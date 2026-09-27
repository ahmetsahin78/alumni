import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Alumni Tracking System | İstanbul Üniversitesi Mezun Takip Sistemi",
  description: "Üniversite mezunları ve öğrencileri arasında güçlü, ömür boyu süren bağlantılar kuran modern kariyer ve mezun ağı.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-500 selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <div className="max-w-7xl mx-auto px-4">
            <p>© {new Date().getFullYear()} Alumni Tracking System — Mezun Takip ve Kariyer Ağı Platformu.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
