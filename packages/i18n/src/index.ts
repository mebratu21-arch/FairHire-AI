import en from '../messages/en.json';
import he from '../messages/he.json';
import am from '../messages/am.json';

export const locales = ['en', 'he', 'am'] as const;
export type SupportedLocale = (typeof locales)[number];
export const defaultLocale: SupportedLocale = 'en';
export const rtlLocales: readonly SupportedLocale[] = ['he'] as const;

export function isRtl(locale: string): boolean {
  return (rtlLocales as readonly string[]).includes(locale);
}

export const messages = {
  en,
  he,
  am,
} as const;

export type Messages = typeof en;
