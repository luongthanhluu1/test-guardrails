import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import React, { useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Location } from "models";

import { useStyles } from "./styles";

interface ProductPormProps {
  data?: Location;
  onSave: (data: Location) => void;
}

const Form = ({ data, onSave }: ProductPormProps) => {
  const classes = useStyles();
  const [location, setlocation] = useState(data || ({} as Location));
  const { t } = useTranslation("common");

  const onChangeValue = (name: keyof Location, value: string) => {
    const newLocation: Location = { ...location };
    switch (name) {
      case "name":
        newLocation.name = value;
        break;
      case "address":
        newLocation.address = value;
        break;
      case "unitPrice":
        newLocation.unitPrice = parseInt(value, 10);
        break;
      case "wastePercent":
        newLocation.wastePercent = parseInt(value, 10);
        break;
    }
    setlocation(newLocation);
  };

  const onChangeBooleanValue = (name: keyof Location, value: boolean) => {
    const newLocation: Location = { ...location };
    switch (name) {
      case "isFactory":
        newLocation.isFactory = value;
        break;
      case "isSupplier":
        newLocation.isSupplier = value;
        break;
      case "isWarehouse":
        newLocation.isWarehouse = value;
        break;
    }
    setlocation(newLocation);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    onSave(location);
  };
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="name"
            label={t("name")}
            value={location.name}
            onChange={(e) => onChangeValue("name", e.target.value)}
            fullWidth={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="address"
            label={t("address")}
            value={location.address}
            onChange={(e) => onChangeValue("address", e.target.value)}
            fullWidth={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={location.isFactory}
                onChange={(e) =>
                  onChangeBooleanValue("isFactory", e.target.checked)
                }
                name="isFactory"
                color="primary"
              />
            }
            label={t("factory")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={location.isSupplier}
                onChange={(e) =>
                  onChangeBooleanValue("isSupplier", e.target.checked)
                }
                name="isSupplier"
                color="primary"
              />
            }
            label={t("supplier")}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={location.isWarehouse}
                onChange={(e) =>
                  onChangeBooleanValue("isWarehouse", e.target.checked)
                }
                name="isWarehouse"
                color="primary"
              />
            }
            label={t("warehouse")}
          />
        </Grid>
      </Grid>
      {location.isFactory && (
        <>
          {/* <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                required={true}
                id="unitPrice"
                label={t("unitPrice")}
                value={location.unitPrice}
                onChange={(e) => onChangeValue("unitPrice", e.target.value)}
                fullWidth={true}
              />
            </Grid>
          </Grid> */}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <TextField
                required={true}
                id="wastePercent"
                label={t("wastePercent")}
                value={location.wastePercent}
                onChange={(e) => onChangeValue("wastePercent", e.target.value)}
                fullWidth={true}
              />
            </Grid>
          </Grid>
        </>
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

export default Form;
