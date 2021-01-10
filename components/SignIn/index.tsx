import { useEffectOnce, useToggle } from "react-use";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Container,
} from "@material-ui/core";
import jwt_decode from "jwt-decode";
import useTranslation from "next-translate/useTranslation";

import { actions } from "stores/user";
import { handleLogin } from "shared/api";
import { login } from "services/auth";
import { RootState } from "stores";

import { useStyles } from "./styles";
import { toast } from "react-toastify";
import { CodeSharp } from "@material-ui/icons";

const LogginForm = () => {
  const classes = useStyles();
  let dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("common");

  const onChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    // if (password === "NahyooJ4pee5buhoo1Va2") {
    //   window.localStorage.setItem("tokenMio", password);
    //   handleLogin(password);
    //   dispatch(actions.setToken(password));
    // }
    login(username, password)
      .then((res) => {
        console.log(res);
        const token = res?.data?.accessToken;
        const decoded: any = jwt_decode(token);
        window.localStorage.setItem("tokenMio", token);
        //   handleLogin(password);
        dispatch(
          actions.setUser({
            token,
            username: decoded?.username,
            role: decoded?.role,
          })
        );
        // console.log(decoded);
      })
      .catch((e) => {
        console.log(e);
        toast.error("asdasd");
      });
  };

  return (
    <Container className={classes.container} maxWidth="sm">
      <form onSubmit={handleSubmit}>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={12}>
            <TextField
              required={true}
              id="username"
              label={t("username")}
              value={username}
              onChange={onChangeUsername}
              fullWidth={true}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextField
              required={true}
              id="password"
              label={t("password")}
              value={password}
              onChange={onChangePassword}
              fullWidth={true}
              variant="outlined"
              type="password"
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          {error && (
            <Grid item xs={12} sm={12}>
              <p className={classes.error}>{t(error)}</p>
            </Grid>
          )}
          <Grid item xs={12} sm={12}>
            <FormControl variant="outlined" fullWidth={true}>
              <Button type="submit" color="primary" variant="contained">
                {t("login")}
              </Button>
            </FormControl>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

interface SignInProps {
  children: React.ReactElement;
}

export const SignIn = ({ children }: SignInProps) => {
  let dispatch = useDispatch();
  let user = useSelector((state: RootState) => state.user);
  // console.log(1234, user);
  let [isLoading, toggleLoading] = useToggle(true);

  useEffectOnce(() => {
    let authToken = window.localStorage.getItem("tokenMio");
    if (!authToken) {
      setTimeout(toggleLoading, 500);
    } else {
      // TODO: Verify token
      handleLogin(authToken);
      const decoded: any = jwt_decode(authToken);
      dispatch(
        actions.setUser({
          token: authToken,
          username: decoded?.username,
          role: decoded?.role,
        })
      );
      setTimeout(toggleLoading, 500);
    }
  });

  if (isLoading) return <div style={{ textAlign: "center" }}>Loading...</div>;
  if (!user || !user.token)
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
