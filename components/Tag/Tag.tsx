import React from "react";
import { Close } from "@material-ui/icons";

import { TagType } from "models/Tag";

import { useStyles } from "./styles";
interface TagProps {
  children: React.ReactElement;
  onClickRemove?: () => void;
}
interface TagValueProp {
  type: TagType;
  value: string;
}
export const Tag = ({ children, onClickRemove = () => {} }: TagProps) => {
  const classes = useStyles();
  return (
    <div className={classes.tag}>
      {children}
      <Close className={classes.closeIcon} onClick={onClickRemove} />
    </div>
  );
};

export const TagValue = ({ type, value }: TagValueProp) => {
  const classes = useStyles();
  return (
    <div className={classes.tag}>
      {type === TagType.COLOR ? (
        <span
          style={{ backgroundColor: `${value}`, marginLeft: 0 }}
          className={classes.colorBox}
        ></span>
      ) : (
        <span>{value}</span>
      )}
    </div>
  );
};
