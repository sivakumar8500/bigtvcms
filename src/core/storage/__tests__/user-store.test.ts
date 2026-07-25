/**
 * User Store Tests
 *
 * Tests the Zustand user store (useUserStore) which manages
 * user authentication profile and session details.
 */

const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

import { useUserStore } from '../user-store';

beforeEach(() => {
  localStorageMock.clear();
  useUserStore.setState({
    user: {
      username: 'DarrenHC.Shen',
      name: 'Darren H.C. Shen',
      role: 'Administrator',
      isLoggedIn: true,
    },
  });
});

describe('useUserStore', () => {
  it('should have initial default user details', () => {
    const { user } = useUserStore.getState();
    expect(user.username).toBe('DarrenHC.Shen');
    expect(user.name).toBe('Darren H.C. Shen');
    expect(user.role).toBe('Administrator');
    expect(user.isLoggedIn).toBe(true);
  });

  it('should login user with custom username and details', () => {
    useUserStore.getState().loginUser('super_editor', {
      name: 'Super Editor',
      role: 'Chief Editor',
    });

    const { user } = useUserStore.getState();
    expect(user.username).toBe('super_editor');
    expect(user.name).toBe('Super Editor');
    expect(user.role).toBe('Chief Editor');
    expect(user.isLoggedIn).toBe(true);
  });

  it('should login user with default role when none provided', () => {
    useUserStore.getState().loginUser('reporter_user');

    const { user } = useUserStore.getState();
    expect(user.username).toBe('reporter_user');
    expect(user.name).toBe('reporter_user');
    expect(user.role).toBe('Administrator');
    expect(user.isLoggedIn).toBe(true);
  });

  it('should update partial user profile using setUser', () => {
    useUserStore.getState().setUser({ name: 'Updated Name', email: 'admin@bigtv.com' });

    const { user } = useUserStore.getState();
    expect(user.name).toBe('Updated Name');
    expect(user.email).toBe('admin@bigtv.com');
    expect(user.username).toBe('DarrenHC.Shen');
  });

  it('should logout user and clear session state', () => {
    useUserStore.getState().logoutUser();

    const { user } = useUserStore.getState();
    expect(user.username).toBe('');
    expect(user.name).toBe('');
    expect(user.role).toBe('');
    expect(user.isLoggedIn).toBe(false);
  });
});
