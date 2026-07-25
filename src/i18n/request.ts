import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: {
      common: (await import(`../messages/${locale}/common.json`)).default,
      auth: (await import(`../messages/${locale}/auth.json`)).default,
      dashboard: (await import(`../messages/${locale}/dashboard.json`)).default,
      news: (await import(`../messages/${locale}/news.json`)).default,
      users: (await import(`../messages/${locale}/users.json`)).default,
      roles: (await import(`../messages/${locale}/roles.json`)).default,
      settings: (await import(`../messages/${locale}/settings.json`)).default,
      validation: (await import(`../messages/${locale}/validation.json`)).default,
      errors: (await import(`../messages/${locale}/errors.json`)).default,
    },
  };
});
