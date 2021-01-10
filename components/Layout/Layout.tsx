import React, { useState } from "react";
import { useEffectOnce } from "react-use";
import { Container } from "@material-ui/core";

import Head from "next/head";
import { Layout } from "antd";
import { Sider } from "components/Sider";
import { SignIn } from "components/SignIn";
import { Header } from "components/Header";
import { AuthContext } from "context/auth";

import { useStyles } from "./styles";

interface CustomLayoutProps {
  children: React.ReactElement;
}
export const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const classes = useStyles();
  const [authTokens, setAuthTokens] = useState("");

  const setTokens = (data: any) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };
  console.log(123);
  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Dashboard</title>
      </Head>

      <SignIn>
        <>
          <Header />
          <div className={classes.container}>
            <Sider />
            <div className={classes.content}>{children}</div>
          </div>
        </>
      </SignIn>
    </AuthContext.Provider>
  );
};
