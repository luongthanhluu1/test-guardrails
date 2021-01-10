import { makeStyles } from "@material-ui/core";

export const useStyles = makeStyles(() => ({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  listTags: {
    display: "flex",
    flexDirection: "row",
    padding: "5px 0px",
  },
  group: {
    marginTop: 15,
  },
}));

export default () => {
  return null;
};
