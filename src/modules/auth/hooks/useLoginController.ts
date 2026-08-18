import { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguageStore } from '@/core/storage/language-store';
import { useUserStore } from '@/core/storage/user-store';
import { formatApiErrorMessage } from '@/core/api/api-client';
import { getLoginSchema, LoginFormData } from '../validators/auth.validator';
import { AuthRepository } from '../repositories/auth.repository';

const toastMessages = {
  en: {
    success: 'Login successful!',
    unexpected: 'An unexpected error occurred',
    locked: 'Your account was locked. Contact admin.',
  },
  te: {
    success: 'లాగిన్ విజయవంతమైంది!',
    unexpected: 'అనూహ్యమైన లోపం సంభవించింది',
    locked: 'మీ ఖాతా లాక్ చేయబడింది. అడ్మిన్‌ను సంప్రదించండి.',
  },
  hi: {
    success: 'लॉगिन सफल रहा!',
    unexpected: 'एक अप्रत्याशित त्रुटि हुई',
    locked: 'आपका खाता लॉक कर दिया गया है। एडमिन से संपर्क करें।',
  },
  ml: {
    success: 'ലോഗിൻ വിജയിച്ചു!',
    unexpected: 'അപ്രതീക്ഷിതമായ ഒരു പിശക് സംഭവിച്ചു',
    locked: 'നിങ്ങളുടെ അക്കൗണ്ട് ലോക്ക് ചെയ്തിരിക്കുന്നു. അഡ്മിനുമായി ബന്ധപ്പെടുക.',
  },
} as const;

export function useLoginController() {
  const router = useRouter();
  const { language } = useLanguageStore();
  const [isPending, startTransition] = useTransition();

  const emptyForm: LoginFormData = {
    username: '',
    password: '',
  };

  const [form, setForm] = useState<LoginFormData>(emptyForm);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        const userRole = (useUserStore.getState().user.role || '').toLowerCase().trim();
        if (userRole === 'epaper_creator') router.replace('/epapers');
        else if (userRole === 'notification_creator') router.replace('/notifications');
        else if (userRole === 'movie_creator') router.replace('/movies');
        else if (
          userRole === 'adsdynapic' ||
          userRole === 'ads_dynapic' ||
          userRole === 'adsdynapix' ||
          userRole === 'ads_dynapix' ||
          userRole === 'adsdynapix_creator' ||
          userRole === 'ads_dynapix_creator'
        )
          router.replace('/ads-dynapix');
        else router.replace('/dashboard');
      }
    }
  }, [router]);

  const handleFieldChange = (field: keyof LoginFormData, val: string) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: val };
      if (submitted) {
        const schema = getLoginSchema(language);
        const res = schema.safeParse(updated);
        if (res.success) {
          setErrors({});
        } else {
          const errMap: Record<string, string> = {};
          res.error.issues.forEach((issue) => {
            if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
          });
          setErrors(errMap);
        }
      }
      return updated;
    });
  };

  const handleToastClose = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    const schema = getLoginSchema(language);
    const validationResult = schema.safeParse(form);
    const errMap: Record<string, string> = {};

    if (!validationResult.success) {
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0]) errMap[issue.path[0] as string] = issue.message;
      });
      setErrors(errMap);
      return;
    }

    setErrors({});

    startTransition(async () => {
      try {
        const res = await AuthRepository.login({
          UserName: form.username,
          password: form.password,
        });

        if (res.creator && res.creator.active === false) {
          setToast({
            open: true,
            message: toastMessages[language]?.locked || toastMessages.en.locked,
            severity: 'error',
          });
          return;
        }

        const token = res.access_token || res.accessToken || res.token;
        if (token) {
          localStorage.setItem('access_token', token);
        }

        const userRole = res.creator?.user_type || res.creator?.role || res.user_type || res.role;
        useUserStore.getState().loginUser(form.username, {
          role: userRole,
          name: res.creator?.name || res.creator?.UserName || form.username,
        });

        const defaultSuccess = toastMessages[language]?.success || toastMessages.en.success;
        const successMsg = typeof res.message === 'string' ? res.message :
                           typeof res.detail === 'string' ? res.detail :
                           (res.message || res.detail ? formatApiErrorMessage(res, defaultSuccess) : defaultSuccess);

        setToast({
          open: true,
          message: String(successMsg),
          severity: 'success',
        });

        // Let the toast display clearly before transitioning to language page
        setTimeout(() => {
          router.push('/language');
        }, 3000);
      } catch (err: any) {
        const errorMsg = err.message || toastMessages[language]?.unexpected || toastMessages.en.unexpected;
        setToast({
          open: true,
          message: errorMsg,
          severity: 'error',
        });
      }
    });
  };

  return {
    form,
    errors,
    isPending,
    toast,
    handleFieldChange,
    handleToastClose,
    handleLoginSubmit,
  };
}
