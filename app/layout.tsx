import './globals.css';
import Link from 'next/link';
import type { ReactNode } from 'react';

const nav = [
  ['Dashboard', '/dashboard'],
  ['Search', '/search'],
  ['Anomaly Explorer', '/anomalies'],
  ['Case Builder', '/cases'],
  ['Timeline', '/timeline'],
  ['FOI Helper', '/foi'],
  ['Methodology', '/about']
] as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-AU">
      <body>
        <header className="border-b bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
            <h1 className="text-lg font-semibold">Public Accountability Radar</h1>
            <nav className="flex gap-4 text-sm text-slate-700">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="hover:text-slate-900">
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </header>
        <main className="mx-auto max-w-7xl p-4">{children}</main>
      </body>
    </html>
  );
}
