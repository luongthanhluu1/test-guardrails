import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  tag: {
    display: "flex",
    padding: "5px 10px",
    borderRadius: 10,
    border: "1px solid #ddd",
    marginRight: 15,
    alignItems: "center",
  },
  colorBox: {
    width: 30,
    height: 30,
    display: "inline-block",
    marginLeft: 15,
    border: "1px solid #ddd",
    borderRadius: 5,
    boxShadow: "1px 1px 3px #888888",
  },
  closeIcon: {
    fontSize: 14,
    marginLeft: 15,
    cursor: "pointer",
  },
}));
