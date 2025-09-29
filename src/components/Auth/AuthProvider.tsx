import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';

interface AuthContextType {
  user: any;
  profile: any;
  loading: boolean;
  isAuthenticated: boolean;
  isCitizen: boolean;
  isMunicipalStaff: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};