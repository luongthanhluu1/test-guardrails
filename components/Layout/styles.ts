import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "row",
  },
  content: {
    minHeight: "calc(100vh - 64px)",
    width: "100%",
    padding: 20,
    display: "flex",
  },
}));
