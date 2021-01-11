import React, { useState } from "react";
import clsx from "clsx";
import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { ChevronLeft, ChevronRight, Inbox, Mail } from "@material-ui/icons";
import { useTheme } from "@material-ui/core/styles";
import Head from "next/head";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";

import { RootState } from "stores";
import { SignIn } from "components/SignIn";
import { Header } from "components/Header";
import { AuthContext } from "context/auth";
import { Role } from "models/User";

import { useStyles } from "./styles";

interface CustomLayoutProps {
  children: React.ReactElement;
}
export const CustomLayout: React.FC<CustomLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useTranslation("common");
  const user = useSelector((state: RootState) => state.user);
  const classes = useStyles(theme);

  const [authTokens, setAuthTokens] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);

  const setTokens = (data: any) => {
    localStorage.setItem("tokens", JSON.stringify(data));
    setAuthTokens(data);
  };

  const onClickMenuIcon = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const goTo = (text: string) => {
    router.push(`/${text}`);
  };

  return (
    <AuthContext.Provider value={{ authTokens, setAuthTokens: setTokens }}>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <title>Dashboard</title>
      </Head>

      <SignIn>
        <>
          <Header onClickMenuIcon={onClickMenuIcon} />
          <div className={classes.container}>
            <Drawer
              className={classes.drawer}
              variant="persistent"
              anchor="left"
              open={drawerOpen}
              classes={{
                paper: classes.drawerPaper,
              }}
            >
              <div className={classes.drawerHeader}>
                <IconButton onClick={handleDrawerClose}>
                  {theme.direction === "ltr" ? (
                    <ChevronLeft />
                  ) : (
                    <ChevronRight />
                  )}
                </IconButton>
              </div>
              <Divider />
              {user?.role === Role.ADMIN && (
                <>
                  <List>
                    {["dashboard", "debt", "user"].map((text, index) => (
                      <ListItem button key={text} onClick={() => goTo(text)}>
                        <ListItemIcon>
                          {index % 2 === 0 ? <Inbox /> : <Mail />}
                        </ListItemIcon>
                        <ListItemText primary={t(text)} />
                      </ListItem>
                    ))}
                  </List>
                  <Divider />
                </>
              )}
              <List>
                {[
                  "item",
                  "tag",
                  "location",
                  "contact",
                  "order",
                  "workflow",
                  "warehouse",
                ].map((text, index) => (
                  <ListItem button key={text} onClick={() => goTo(text)}>
                    <ListItemIcon>
                      {index % 2 === 0 ? <Inbox /> : <Mail />}
                    </ListItemIcon>
                    <ListItemText primary={t(text)} />
                  </ListItem>
                ))}
              </List>
            </Drawer>
            <div
              className={clsx(classes.content, {
                [classes.contentShift]: drawerOpen,
              })}
            >
              {children}
            </div>
          </div>
        </>
      </SignIn>
    </AuthContext.Provider>
  );
};
