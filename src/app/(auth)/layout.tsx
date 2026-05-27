import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[var(--color-bg-200)] flex flex-col">
      {/* Minimal header */}
      <header className="bg-white border-b border-[var(--color-bg-300)] px-4 py-4">
        <div className="max-w-sm mx-auto flex justify-center">
          <Link href="/">
            <Logo />
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-start justify-center px-4 py-10">
        {children}
      </main>

      {/* Minimal footer */}
      <footer className="py-4 px-4 text-center text-xs text-gray-400">
        <Link href="/legal/pryvatnist" className="hover:underline mr-3">
          Конфіденційність
        </Link>
        <Link href="/legal/oferta" className="hover:underline mr-3">
          Оферта
        </Link>
        <Link href="/" className="hover:underline">
          legar.com.ua
        </Link>
      </footer>
    </div>
  );
}
