import { z } from 'zod';

export const authValidationMessages = {
  en: {
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
  },
  te: {
    usernameRequired: 'యూజర్ నేమ్ అవసరం',
    passwordRequired: 'పాస్‌వర్డ్ అవసరం',
  },
  hi: {
    usernameRequired: 'उपयोगकर्ता नाम आवश्यक है',
    passwordRequired: 'पासवर्ड आवश्यक है',
  },
  ml: {
    usernameRequired: 'യൂസർനാമം ആവശ്യമാണ്',
    passwordRequired: 'പാസ്‌വേഡ് ആവശ്യമാണ്',
  },
} as const;

export const getLoginSchema = (lang: 'en' | 'te' | 'hi' | 'ml') => {
  const t = authValidationMessages[lang] || authValidationMessages.en;
  return z.object({
    username: z.string().trim().min(1, t.usernameRequired),
    password: z.string().min(1, t.passwordRequired),
  });
};

export type LoginFormData = z.infer<ReturnType<typeof getLoginSchema>>;
