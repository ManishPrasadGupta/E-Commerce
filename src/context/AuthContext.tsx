'use client';

import { useSession } from "next-auth/react";
import { createContext, useContext } from "react";

type AuthContextType = {
  isLoggedIn: boolean;
  user: Record<string, unknown> | null;
};

const AuthContext = createContext<AuthContextType>({ isLoggedIn: false, user: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data: session, status } = useSession();
  const isLoggedIn = status === "authenticated";
  const user = session?.user || null;

  return (
    <AuthContext.Provider value={{ isLoggedIn, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);