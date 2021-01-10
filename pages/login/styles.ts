import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  error: {
    color: "red",
  },
}));

export default () => {
  return null;
};
