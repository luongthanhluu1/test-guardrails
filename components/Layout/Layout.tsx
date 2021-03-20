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
import {
  AttachMoney,
  AccountTree,
  ChevronLeft,
  ChevronRight,
  Dashboard,
  LocationOn,
  ListAlt,
  HomeWork,
  Group,
  Label,
  ContactPhone,
} from "@material-ui/icons";
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
  const [drawerOpen, setDrawerOpen] = useState(true);

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
        <div className={classes.root}>
          <Header
            onClickMenuIcon={onClickMenuIcon}
            className={clsx(classes.appBar, {
              [classes.appBarShift]: drawerOpen,
            })}
          />
          <Drawer
            variant="permanent"
            className={clsx(classes.drawer, {
              [classes.drawerOpen]: drawerOpen,
              [classes.drawerClose]: !drawerOpen,
            })}
            classes={{
              paper: clsx({
                [classes.drawerOpen]: drawerOpen,
                [classes.drawerClose]: !drawerOpen,
              }),
            }}
          >
            <div className={classes.drawerHeader}>
              <IconButton onClick={handleDrawerClose}>
                {theme.direction === "ltr" ? <ChevronLeft /> : <ChevronRight />}
              </IconButton>
            </div>
            <Divider />
            {user?.role === Role.ADMIN && (
              <>
                <List>
                  {[
                    { name: "dashboard", icon: <Dashboard /> },
                    { name: "debt", icon: <AttachMoney /> },
                    { name: "user", icon: <Group /> },
                  ].map((item, index) => (
                    <ListItem
                      button
                      key={item.name}
                      onClick={() => goTo(item.name)}
                    >
                      <ListItemIcon>{item.icon}</ListItemIcon>
                      <ListItemText primary={t(item.name)} />
                    </ListItem>
                  ))}
                </List>
                <Divider />
              </>
            )}
            <List>
              {[
                { name: "item", icon: <Dashboard /> },
                { name: "tag", icon: <Label /> },
                { name: "location", icon: <LocationOn /> },
                { name: "contact", icon: <ContactPhone /> },
                { name: "order", icon: <ListAlt /> },
                { name: "workflow", icon: <AccountTree /> },
                { name: "warehouse", icon: <HomeWork /> },
              ].map((item, index) => (
                <ListItem
                  button
                  key={item.name}
                  onClick={() => goTo(item.name)}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={t(item.name)} />
                </ListItem>
              ))}
            </List>
          </Drawer>
          <div className={classes.container}>
            <div
              // className={clsx(classes.content, {
              //   [classes.contentShift]: drawerOpen,
              // })}
              className={classes.childContainer}
            >
              {children}
            </div>
          </div>
        </div>
      </SignIn>
    </AuthContext.Provider>
  );
};
