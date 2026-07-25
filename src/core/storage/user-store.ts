import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface UserProfile {
  username: string;
  name?: string;
  role?: string;
  email?: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
}

interface UserState {
  user: UserProfile;
  setUser: (user: Partial<UserProfile>) => void;
  loginUser: (username: string, extra?: { name?: string; role?: string; avatarUrl?: string }) => void;
  logoutUser: () => void;
}

const defaultUser: UserProfile = {
  username: 'DarrenHC.Shen',
  name: 'Darren H.C. Shen',
  role: 'Administrator',
  isLoggedIn: true,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: defaultUser,
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
      loginUser: (username, extra) =>
        set({
          user: {
            username,
            name: extra?.name || username,
            role: extra?.role || 'Administrator',
            avatarUrl: extra?.avatarUrl,
            isLoggedIn: true,
          },
        }),
      logoutUser: () =>
        set({
          user: {
            username: '',
            name: '',
            role: '',
            avatarUrl: '',
            isLoggedIn: false,
          },
        }),
    }),
    {
      name: 'bigtv-user-store',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : (undefined as any))),
    }
  )
);
