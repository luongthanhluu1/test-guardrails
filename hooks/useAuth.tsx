import React, { useContext, createContext, useState } from "react";
/** For more details on
 * `authContext`, `ProvideAuth`, `useAuth` and `useProvideAuth`
 * refer to: https://usehooks.com/useAuth/
 */
interface Auth {
  user: any;
  signin: (cb: () => void) => void;
  signout: (cb: () => void) => void;
}

const authContext = createContext({} as Auth);

export function ProvideAuth({ children }: { children: React.ReactElement }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export function useAuth() {
  return useContext(authContext);
}

export function useProvideAuth() {
  const [user, setUser] = useState(null);

  const signin = (cb: () => void) => {
    // return fakeAuth.signin(() => {
    //   setUser("user");
    //   cb();
    // });
  };

  const signout = (cb: () => void) => {
    // return fakeAuth.signout(() => {
    setUser(null);
    //   cb();
    // });
  };

  return {
    user,
    signin,
    signout,
  };
}
