import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import ProtonSDK, { User } from '../../services/proton';
import proton from '../../services/proton-rpc';
import { usePrevious } from '../../hooks';
import { EMPTY_BALANCE } from '../../utils/constants';

interface AuthContext {
  currentUser: User;
  currentUserBalance: string;
  authError: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUserBalance: (chainAccount: string) => Promise<void>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AuthContext = createContext<AuthContext>({
  currentUser: undefined,
  currentUserBalance: '',
  authError: '',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateCurrentUserBalance: () => Promise.resolve(),
});

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [currentUserBalance, setCurrentUserBalance] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
  const prevError = usePrevious(authError);

  useEffect(() => {
    if (prevError) {
      setAuthError('');
    }
  }, [prevError]);

  useEffect(() => {
    if (typeof window !== 'undefined' && !currentUser) {
      const cachedUser = localStorage.getItem('proton-storage-user-auth');

      if (cachedUser) {
        const { actor, permission } = JSON.parse(cachedUser);
        setCurrentUser({
          actor,
          permission,
          name: '',
          avatar: '/default-avatar.png',
          isLightKYCVerified: false,
        });
      }

      const restore = async () => {
        const { user, error } = await ProtonSDK.restoreSession();

        if (error || !user) {
          const errorMessage = error
            ? `Error: ${error}`
            : 'Error: No user was found';
          setAuthError(errorMessage);
          return;
        }

        await updateCurrentUserBalance(user.actor);
        setCurrentUser(user);
      };

      restore();
    }
  }, []);

  const updateCurrentUserBalance = async (chainAccount: string) => {
    const balance = await proton.getAtomicMarketBalance(chainAccount);
    setCurrentUserBalance(balance);
  };

  const login = async (): Promise<void> => {
    const { user, error } = await ProtonSDK.login();
    if (error || !user) {
      const errorMessage = error
        ? `Error: ${error}`
        : 'Error: No user was found';
      setAuthError(errorMessage);
      return;
    }

    await updateCurrentUserBalance(user.actor);
    setCurrentUser(user);
  };

  const logout = async () => {
    await ProtonSDK.logout();
    setCurrentUser(undefined);
  };

  const value = useMemo<AuthContext>(
    () => ({
      currentUser,
      currentUserBalance,
      authError,
      login,
      logout,
      updateCurrentUserBalance,
    }),
    [currentUser, authError, currentUserBalance]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
