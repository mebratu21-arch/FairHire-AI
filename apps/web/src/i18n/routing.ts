import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'he', 'am'],
  defaultLocale: 'en',
});

export const rtlLocales = ['he'] as const;
