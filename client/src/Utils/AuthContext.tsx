import { createContext, useState, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  isSignedUp: boolean;
  setSignedUp: (value: boolean) => void;
  forgotPassword: boolean;
  setForgotPassword: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [isSignedUp, setSignedUp] = useState<boolean>(false);
  const [forgotPassword, setForgotPassword] = useState<boolean>(false);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, setAuthenticated, isSignedUp, setSignedUp, forgotPassword, setForgotPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
