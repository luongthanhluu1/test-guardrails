import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { SketchPicker } from "react-color";
import { User, Role, RoleOptions } from "models/User";

import { useStyles } from "./styles";

interface ProductPormProps {
  data?: User;
  onSave: (data: User) => void;
}

const Login = ({ data, onSave }: ProductPormProps) => {
  const classes = useStyles();
  const [role, setRole] = useState(data?.role || Role.MEMBER);
  const [username, setUsername] = useState(data?.username || "");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [error, setError] = useState("");
  const { t } = useTranslation("common");
  const onChangeUsername = (e: any) => {
    setUsername(e.target.value);
  };
  const onChangePassword = (e: any) => {
    setPassword(e.target.value);
  };

  const validate = () => {
    let errorMessage = "";
    if (!data?._id) {
      if (!password) {
        errorMessage = "need input password";
        return errorMessage;
      }
      if (!repassword) {
        errorMessage = "need input repassword";
        return errorMessage;
      }
    }
    if (password) {
      if (password !== repassword) {
        errorMessage = "password and repassword need the same";
        return errorMessage;
      }
    }
    return errorMessage;
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const errorMessage = validate();
    if (!errorMessage) {
      const updateData: User = {
        role,
        username,
      };
      if (password) {
        updateData.password = password;
      }
      onSave(updateData);
    } else {
      setError(errorMessage);
    }
  };
  return (
    <div className={classes.container}>
      <form onSubmit={onSubmit}>
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
    </div>
  );
};

export default Login;
