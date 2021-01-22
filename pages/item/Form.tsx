import { Grid, TextField, FormControl, Button } from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import React, { ChangeEvent, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

import { Color } from "components/Color";
import { Tag as TagComponent } from "components/Tag";
import { PriceInputFormat } from "components/PriceInutFormat";
import { Tag, TagType } from "models/Tag";
import { Product } from "models/Product";
import { getList } from "services";

import { useStyles } from "./styles";
interface ProductPormProps {
  data?: Product;
  onSave: (data: Product) => void;
}
const ProductForm = ({ data, onSave }: ProductPormProps) => {
  const classes = useStyles();
  // const router = useRouter();
  const [autocompleteColorValue, setAutocompleteColorValue] = useState("");
  const [autocompleteTagValue, setAutocompleteTagValue] = useState("");
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [colorList, setColorList] = useState<Tag[]>([]);
  const [productCode, setProductCode] = useState(data?.name || "");
  const [name, setName] = useState(data?.name || "");
  const [price, setPrice] = useState(data?.price || "");
  const [inputPrice, setInputPrice] = useState(data?.inputPrice || "");
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState<Tag[]>(
    data?.tags?.filter((tag) => tag.type === TagType.TAG) || []
  );
  const [colors, setColors] = useState<Tag[]>(
    data?.tags?.filter((tag) => tag.type === TagType.COLOR) || []
  );
  const { t } = useTranslation("common");

  useEffect(() => {
    getList("tag").then((res) => {
      setTagsList(res.data.filter((item: Tag) => item.type === TagType.TAG));
      setColorList(res.data.filter((item: Tag) => item.type === TagType.COLOR));
    });
  }, []);

  const onSelectTag = (tag: Tag | null) => {
    setTimeout(() => setAutocompleteTagValue(""));
    if (tag) {
      const filterd = tags.filter((item) => item.value === tag.value);
      if (filterd.length === 0) {
        setTags([...tags, tag]);
      }
    }
  };

  const onSelectColor = (tag: Tag | null) => {
    setTimeout(() => setAutocompleteColorValue(""));
    if (tag) {
      const filterd = colors.filter((item) => item.value === tag.value);
      if (filterd.length === 0) {
        setColors([...colors, tag]);
      }
    }
  };

  const removeColor = (i: number) => {
    const newColors = [...colors];
    newColors.splice(i, 1);
    setColors(newColors);
  };

  const removeTag = (i: number) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    setTags(newTags);
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    const updateData = {
      name,
      price: price || 0,
      inputPrice,
      tags: [...tags, ...colors],
    };
    onSave(updateData);
  };

  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={12}>
          <TextField
            id="productCode"
            label={t("productCode")}
            value={productCode}
            onChange={(e) => setProductCode(e.target.value)}
            fullWidth={true}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="name"
            label={t("productName")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth={true}
            variant="outlined"
          />
        </Grid>
        {/* <Grid item xs={12} md={6}>
          <div className={classes.listTags}>
            {colors.map((tag, i) => (
              <TagComponent
                key={tag.value}
                onClickRemove={() => removeColor(i)}
              >
                <Color item={tag} />
              </TagComponent>
            ))}
          </div>
          <Autocomplete
            id="selectColor"
            options={colorList}
            inputValue={autocompleteColorValue}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) => option.name}
            renderOption={(option) => <Color item={option} />}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("selectColor")}
                variant="outlined"
                fullWidth={true}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  setAutocompleteColorValue(e.target.value);
                }}
              />
            )}
            onChange={(e, value) => onSelectColor(value)}
          />
        </Grid> */}
        <Grid item xs={12} md={12}>
          <div className={classes.listTags}>
            {tags.map((tag, i) => (
              <TagComponent key={tag.value} onClickRemove={() => removeTag(i)}>
                <span>{tag.value}</span>
              </TagComponent>
            ))}
          </div>
          <Autocomplete
            id="selectType"
            options={tagsList}
            inputValue={autocompleteTagValue}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) => option.name}
            renderOption={(option) => <Color item={option} />}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("selectType")}
                variant="outlined"
                fullWidth={true}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  setAutocompleteTagValue(e.target.value);
                }}
              />
            )}
            onChange={(e: any, value: Tag | null) => onSelectTag(value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id="price"
            label={t("sell price")}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            fullWidth={true}
            InputProps={{
              inputComponent: PriceInputFormat,
            }}
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id="inputPrice"
            label={t("input price")}
            value={inputPrice}
            onChange={(e) => setInputPrice(e.target.value)}
            fullWidth={true}
            InputProps={{
              inputComponent: PriceInputFormat,
            }}
            variant="outlined"
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.group}>
        <Grid item xs={12} sm={12}>
          <FormControl variant="outlined" fullWidth={true}>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={loading}
            >
              {t("save")}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;
