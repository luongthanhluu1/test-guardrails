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
import { Contact } from "models";

import { useStyles } from "./styles";

interface ProductPormProps {
  data?: Contact;
  onSave: (data: Contact) => void;
}

const Form = ({ data, onSave }: ProductPormProps) => {
  const classes = useStyles();
  const [contact, setContact] = useState(data || ({} as Contact));
  const { t } = useTranslation("common");

  const onChangeValue = (name: keyof Contact, value: string) => {
    const newContact: Contact = { ...contact };
    switch (name) {
      case "name":
        newContact.name = value;
        break;
      case "address":
        newContact.address = value;
        break;
      case "phone":
        newContact.phone = value;
        break;
    }
    setContact(newContact);
  };

  const onChangeBooleanValue = (name: keyof Contact, value: boolean) => {
    const newContact: Contact = { ...contact };
    switch (name) {
      case "isCustomer":
        newContact.isCustomer = value;
        break;
      case "isDeliver":
        newContact.isDeliver = value;
        break;
    }
    setContact(newContact);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    onSave(contact);
  };
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="name"
            label={t("name")}
            value={contact.name}
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
            value={contact.address}
            onChange={(e) => onChangeValue("address", e.target.value)}
            fullWidth={true}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="phone"
            label={t("phone")}
            value={contact.phone}
            onChange={(e) => onChangeValue("phone", e.target.value)}
            fullWidth={true}
          />
        </Grid>
      </Grid>
      {/* <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={contact.isCustomer}
                onChange={(e) =>
                  onChangeBooleanValue("isCustomer", e.target.checked)
                }
                name="isCustomer"
                color="primary"
              />
            }
            label={t("customer")}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControlLabel
            control={
              <Checkbox
                checked={contact.isDeliver}
                onChange={(e) =>
                  onChangeBooleanValue("isDeliver", e.target.checked)
                }
                name="isDeliver"
                color="primary"
              />
            }
            label={t("deliver")}
          />
        </Grid>
      </Grid> */}
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
