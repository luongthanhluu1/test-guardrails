import { useEffectOnce, useToggle } from "react-use";
import { Button, Input } from "antd";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { actions } from "stores/user";
import { handleLogin } from "shared/api";

const LogginForm = () => {
  let dispatch = useDispatch();
  let [password, setPassword] = useState("");

  let handleSubmit = () => {
    if (password === "NahyooJ4pee5buhoo1Va2") {
      window.localStorage.setItem("tokenMio", password);
      handleLogin(password);
      dispatch(actions.setToken(password));
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Input
        id="Password"
        style={{ width: 320 }}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        addonAfter={<Button onClick={handleSubmit}>Login</Button>}
      />
    </div>
  );
};

export const SignIn = ({ children }) => {
  let dispatch = useDispatch();
  let token = useSelector((state) => state.user?.token);
  let [isLoading, toggleLoading] = useToggle(true);

  useEffectOnce(() => {
    let authToken = window.localStorage.getItem("tokenMio");
    if (!authToken) {
      setTimeout(toggleLoading, 500);
    } else {
      // TODO: Verify token
      handleLogin(authToken);
      dispatch(actions.setToken(authToken));
      setTimeout(toggleLoading, 500);
    }
  });

  if (isLoading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (!token)
    return (
      <div
        style={{
          display: "flex",
          height: "100vh",
          // justifyContent: 'center',
          // alignItems: 'center',
          flexDirection: "column",
          marginTop: 32,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 26,
          }}
        >
          <img
            src="/logoMio.png"
            alt="iTAPHOA logo"
            style={{ height: 82, width: 82 }}
          />
        </div>
        <LogginForm />
      </div>
    );
  return children;
};
