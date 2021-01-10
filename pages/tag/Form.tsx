import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { SketchPicker } from "react-color";
import { Tag, TagOptions, TagType } from "models/Tag";

import { useStyles } from "./styles";
import { ColorBox } from "components/Color";

interface ProductPormProps {
  data?: Tag;
  onSave: (data: Tag) => void;
}

const TagForm = ({ data, onSave }: ProductPormProps) => {
  const classes = useStyles();
  const [type, setType] = useState(data?.type || TagType.TAG);
  const [color, setColor] = useState(data?.value || "");
  const [name, setName] = useState(data?.name || "");
  const { t } = useTranslation("common");
  const onChangeType = (e: any) => {
    const value = e.target.value;
    setType(value);
  };
  const onChangeColor = (e: any) => {
    setColor(e.hex);
  };
  const onChangeName = (e: any) => {
    setName(e.target.value);
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    const updateData = {
      type,
      name,
      value: type === TagType.TAG ? name : type === TagType.COLOR ? color : "",
    };
    onSave(updateData);
  };
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={4}>
        {/* <Grid item xs={12} sm={12}>
          <FormControl variant="outlined" fullWidth={true}>
            <InputLabel id="type-label" required={true}>
              {t("type")}/{t("color")}
            </InputLabel>
            <Select
              labelId="type-label"
              id="type"
              onChange={onChangeType}
              defaultValue={type}
              label={`${t("type")}/${t("color")}`}
              fullWidth={true}
              required={true}
            >
              {TagOptions.map((option) => (
                <MenuItem value={option}>{t(option)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="name"
            label={t("name")}
            value={name}
            onChange={onChangeName}
            fullWidth={true}
          />
        </Grid>
      </Grid>
      {type === TagType.COLOR && (
        <Grid container spacing={2} className={classes.group}>
          <Grid item xs={12} sm={12}>
            <FormControl variant="outlined" fullWidth={true}>
              <div className={classes.colorContainer}>
                <span className={classes.colorText}>{t("color")}: </span>{" "}
                <ColorBox color={color} />
              </div>
              <SketchPicker color={color} onChange={onChangeColor} />
            </FormControl>
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2} className={classes.group}>
        <Grid item xs={12} sm={12}>
          <FormControl variant="outlined" fullWidth={true}>
            <Button type="submit" color="primary" variant="contained">
              {t("save")}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default TagForm;
