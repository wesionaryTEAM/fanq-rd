import { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ supabase, ...props }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        signOut: () => supabase.auth.signOut(),
      }}
      {...props}
    />
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
