import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  colorIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    display: "inline-block",
  },
  name: {
    marginRight: 15,
  },
  colorBox: {
    width: 30,
    height: 30,
    display: "inline-block",
    border: "1px solid #ddd",
    borderRadius: 5,
    boxShadow: "1px 1px 3px #888888",
  },
}));
