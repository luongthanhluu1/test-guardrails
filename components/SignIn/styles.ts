import { colors, makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    maxWidth: 400,
  },
  error: {
    color: colors.red.A700,
  },
}));
