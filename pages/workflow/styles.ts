import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  colorContainer: {
    padding: "10px 0px",
    display: "flex",
  },
  group: {
    marginTop: 15,
  },
  colorText: {
    marginRight: 15,
  },
  totalText: {
    fontSize: "1.4em",
    fontWeight: "bold",
  },
}));

export default () => {
  return null;
};
