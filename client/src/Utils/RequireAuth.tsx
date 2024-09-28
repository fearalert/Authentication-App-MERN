import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext/useAuth';

interface AuthGuardProps {
  children: ReactNode;
}

export const RequireAuth = ({ children }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};


export const RequireSignup = ({ children }: AuthGuardProps) => {
  const { isSignedUp } = useAuth();
  return isSignedUp ? <>{children}</> : <Navigate to="/signup" replace />;
};

export const RequireForgotPassword = ({ children }: AuthGuardProps) => {
  const { forgotPassword } = useAuth();
  return forgotPassword ? <>{children}</> : <Navigate to="/forgot-password" replace />;
};
