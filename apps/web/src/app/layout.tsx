import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FairHire AI - Ethical Multi-lingual Recruitment Platform',
  description: 'AI recruitment platform supporting EN, Hebrew RTL, and Amharic with unbiased CV screening and counterfactual fairness audits.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192.png',
    apple: '/icon-512.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
