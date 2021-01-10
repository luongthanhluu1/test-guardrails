import { Backdrop, CircularProgress } from "@material-ui/core";
import React from "react";

import { useStyles } from "./styles";

export const Loading = () => {
  //   const classes = useStyles();
  return (
    <Backdrop open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};
