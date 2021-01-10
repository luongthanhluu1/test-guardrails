import { colors, makeStyles } from "@material-ui/core";

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
    marginBottom: 15,
  },
  colorText: {
    marginRight: 15,
  },
  colorRed: {
    color: colors.red.A700,
  },
  colorOrange: {
    color: colors.orange.A700,
  },
}));

export default () => {
  return null;
};
