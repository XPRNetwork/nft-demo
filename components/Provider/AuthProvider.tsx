import { createContext, useState, useContext, useEffect, useMemo } from 'react';
import ProtonSDK, { User } from '../../services/proton';
import { usePrevious } from '../../hooks';

interface AuthContext {
  currentUser: User;
  error: string;
  login: () => Promise<void>;
  logout: () => void;
}

interface Props {
  children: JSX.Element | JSX.Element[];
}

const AuthContext = createContext<AuthContext>({
  currentUser: undefined,
  error: '',
  login: () => Promise.resolve(),
  logout: () => {},
});

export const useAuthContext = (): AuthContext => {
  const context = useContext(AuthContext);
  return context;
};

export const AuthProvider = ({ children }: Props): JSX.Element => {
  const [currentUser, setCurrentUser] = useState<User>(undefined);
  const [error, setError] = useState('');
  const prevError = usePrevious(error);

  useEffect(() => {
    if (prevError) {
      setError('');
    }
  }, [prevError]);

  useEffect(() => {
    const restore = async () => {
      const { user, error } = await ProtonSDK.restoreSession();

      if (error || !user) {
        const errorMessage = error
          ? `Error: ${error}`
          : 'Error: No user was found';
        setError(errorMessage);
        return;
      }

      setCurrentUser(user);
    };

    restore();
  }, []);

  const login = async (): Promise<void> => {
    const { user, error } = await ProtonSDK.login();
    if (error || !user) {
      const errorMessage = error
        ? `Error: ${error}`
        : 'Error: No user was found';
      setError(errorMessage);
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
      error,
      login,
      logout,
    }),
    [currentUser, error]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
