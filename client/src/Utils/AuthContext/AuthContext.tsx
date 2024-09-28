import { createContext, useState, ReactNode, useEffect } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  isSignedUp: boolean;
  setSignedUp: (value: boolean) => void;
  forgotPassword: boolean;
  setForgotPassword: (value: boolean) => void;
  refreshToken: string | null;
  setRefreshToken: (token: string | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isSignedUp, setSignedUp] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && isTokenValid(token)) {
      setAuthenticated(true);
      setRefreshToken(token);
    }
  }, []);

  const isTokenValid = (token: string): boolean => {
    if (!token || !token.includes('.')) return false;
    const parts = token.split('.');
    if (parts.length !== 3) return false;

    try {
      const payload = JSON.parse(atob(parts[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error:any) {
      console.log("Auth error", error)
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated, isSignedUp, setSignedUp, forgotPassword, setForgotPassword, refreshToken, setRefreshToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
