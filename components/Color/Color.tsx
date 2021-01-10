import React from "react";

import { Tag } from "models/Tag";

import { useStyles } from "./styles";

interface ColorProps {
  item: Tag;
}
export const Color = ({ item }: ColorProps) => {
  const classes = useStyles();
  return (
    <>
      <span
        style={{
          backgroundColor: item.value,
        }}
        className={classes.colorIcon}
      ></span>
      <span className={classes.name}>{item.name}</span>
    </>
  );
};

interface ColorBoxProps {
  color: string;
}

export const ColorBox = ({ color }: ColorBoxProps) => {
  const classes = useStyles();
  return (
    <span
      style={{ backgroundColor: color }}
      className={classes.colorBox}
    ></span>
  );
};
