import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores";
import { actions } from "stores/user";

import { useStyles } from "./styles";

export const Header = () => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state: RootState) => state.user);
  const logout = () => {
    window.localStorage.removeItem("tokenMio");
    //   handleLogin(password);
    dispatch(actions.setUser({}));
  };
  return (
    <AppBar position="static">
      <Toolbar>
        {/* <IconButton
          edge="start"
          //   className={classes.menuButton}
          color="inherit"
          aria-label="menu"
        >
          <Menu />
        </IconButton>
        <Typography variant="h6">News</Typography> */}
        <Button color="inherit">{user?.username}</Button>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
