import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import ProtonSDK, { User } from '../../services/proton';
import proton from '../../services/proton-rpc';
import { usePrevious } from '../../hooks';

interface AuthContext {
  currentUser: User;
  currentUserBalance: string;
  atomicMarketBalance: string;
  authError: string;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateBalances: (chainAccount: string) => Promise<void>;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AuthContext = createContext<AuthContext>({
  currentUser: undefined,
  currentUserBalance: '',
  atomicMarketBalance: '',
  authError: '',
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  updateBalances: () => Promise.resolve(),
});

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [currentUserBalance, setCurrentUserBalance] = useState<string>('');
  const [atomicMarketBalance, setAtomicMarketBalance] = useState<string>('');
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

        await updateBalances(user.actor);
        setCurrentUser(user);
      };

      restore();
    }
  }, []);

  const updateBalances = async (chainAccount: string) => {
    let balance = await proton.getAtomicMarketBalance(chainAccount);
    setAtomicMarketBalance(balance);

    balance = await proton.getAccountBalance(chainAccount);
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

    await updateBalances(user.actor);
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
      atomicMarketBalance,
      authError,
      login,
      logout,
      updateBalances,
    }),
    [currentUser, authError, currentUserBalance]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
