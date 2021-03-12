import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import ProtonSDK, { User } from '../../services/proton';
import { usePrevious } from '../../hooks';

interface AuthContext {
  currentUser: User;
  authError: string;
  login: () => Promise<void>;
  logout: () => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AuthContext = createContext<AuthContext>({
  currentUser: undefined,
  authError: '',
  login: () => Promise.resolve(),
  logout: () => {},
});

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [authError, setAuthError] = useState('');
  const prevError = usePrevious(authError);

  useEffect(() => {
    if (prevError) {
      setAuthError('');
    }
  }, [prevError]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
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

        setCurrentUser(user);
      };

      restore();
    }
  }, []);

  const login = async (): Promise<void> => {
    const { user, error } = await ProtonSDK.login();
    if (error || !user) {
      const errorMessage = error
        ? `Error: ${error}`
        : 'Error: No user was found';
      setAuthError(errorMessage);
      return;
    }

    setCurrentUser(user);
  };

  const logout = async () => {
    await ProtonSDK.logout();
    setCurrentUser(undefined);
  };

  const value = useMemo<AuthContext>(
    () => ({
      currentUser,
      authError,
      login,
      logout,
    }),
    [currentUser, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
