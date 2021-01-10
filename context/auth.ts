import { createContext, useContext } from "react";
interface Auth {
  authTokens: string;
  setAuthTokens: (token: string) => void;
}
export const AuthContext = createContext<Auth>({} as Auth);

export function useAuth() {
  return useContext(AuthContext);
}
