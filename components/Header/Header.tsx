import {
  AppBar,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { Menu } from "@material-ui/icons";
import useTranslation from "next-translate/useTranslation";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "stores";
import { actions } from "stores/user";

import { useStyles } from "./styles";
interface HeaderProps {
  onClickMenuIcon: () => void;
}
export const Header: React.FC<HeaderProps> = ({ onClickMenuIcon }) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const user = useSelector((state: RootState) => state.user);

  const { t } = useTranslation("common");
  const logout = () => {
    window.localStorage.removeItem("tokenMio");
    dispatch(actions.setUser({}));
  };

  return (
    <AppBar position="fixed">
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onClickMenuIcon}
        >
          <Menu />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          {t(`${user?.role}`)} - {user?.username}
        </Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};
