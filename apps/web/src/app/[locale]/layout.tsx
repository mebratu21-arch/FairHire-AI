import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Inter, Noto_Sans_Hebrew, Noto_Sans_Ethiopic } from 'next/font/google';
import { rtlLocales } from '@/i18n/routing';
import '../globals.css';
import { Navbar } from '@/components/navbar';

const latin = Inter({
  subsets: ['latin'],
  variable: '--font-latin',
  display: 'swap',
});

const hebrew = Noto_Sans_Hebrew({
  subsets: ['hebrew'],
  variable: '--font-he',
  display: 'swap',
});

const ethiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  variable: '--font-am',
  display: 'swap',
});

export const metadata = {
  title: 'FairHire AI | Decision Support for Fair Recruitment',
  description:
    'Bias-free candidate screening with blind review, cited evidence, and cryptographic auditability for Israeli and global hiring.',
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();
  const dir = (rtlLocales as readonly string[]).includes(locale) ? 'rtl' : 'ltr';

  const fontClass =
    locale === 'he'
      ? `${hebrew.variable} font-hebrew`
      : locale === 'am'
        ? `${ethiopic.variable} font-ethiopic`
        : `${latin.variable} font-latin`;

  return (
    <html lang={locale} dir={dir} className={`${latin.variable} ${hebrew.variable} ${ethiopic.variable}`}>
      <body className={`bg-[#090d16] text-slate-100 min-h-screen ${fontClass}`}>
        <NextIntlClientProvider messages={messages}>
          <Navbar currentLocale={locale} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">{children}</main>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
