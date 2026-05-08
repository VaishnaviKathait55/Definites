import { createContext, useContext, useEffect, useState } from 'react';
import {
  changePassword as changePasswordRequest,
  clearStoredAuth,
  getCurrentUser,
  getStoredAuth,
  loginUser,
  setStoredAuth,
} from '../api/client';

const AuthContext = createContext(null);

function emptyAuthState(isReady = true) {
  return {
    ready: isReady,
    token: null,
    user: null,
    mustChangePassword: false,
  };
}

function buildSession(token, user) {
  return {
    token,
    user,
    mustChangePassword: Boolean(user?.mustChangePassword),
  };
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState(() => {
    const storedAuth = getStoredAuth();

    if (!storedAuth?.token) {
      return emptyAuthState(true);
    }

    return {
      ready: false,
      token: storedAuth.token,
      user: storedAuth.user || null,
      mustChangePassword: Boolean(storedAuth.mustChangePassword),
    };
  });

  useEffect(() => {
    if (!authState.token) {
      return;
    }

    let ignore = false;

    async function hydrateSession() {
      try {
        const response = await getCurrentUser();
        const session = buildSession(authState.token, response.user);
        setStoredAuth(session);

        if (!ignore) {
          setAuthState({
            ready: true,
            ...session,
          });
        }
      } catch {
        clearStoredAuth();

        if (!ignore) {
          setAuthState(emptyAuthState(true));
        }
      }
    }

    hydrateSession();

    return () => {
      ignore = true;
    };
  }, [authState.token]);

  const value = {
    ...authState,
    async login(credentials) {
      const response = await loginUser(credentials);
      const session = buildSession(response.token, response.user);
      setStoredAuth(session);
      setAuthState({
        ready: true,
        ...session,
      });
      return response;
    },
    logout() {
      clearStoredAuth();
      setAuthState(emptyAuthState(true));
    },
    async changePassword(payload) {
      const response = await changePasswordRequest(payload);
      const session = buildSession(authState.token, response.user);
      setStoredAuth(session);
      setAuthState((previousState) => ({
        ...previousState,
        ...session,
        ready: true,
      }));
      return response;
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider.');
  }

  return context;
}
