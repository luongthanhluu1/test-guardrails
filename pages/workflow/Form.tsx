import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from "@material-ui/core";
import React, { ChangeEvent, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { SketchPicker } from "react-color";
import { Tag, TagOptions, TagType } from "models/Tag";

import { useStyles } from "./styles";
import { ColorBox } from "components/Color";
import { Autocomplete } from "@material-ui/lab";
import { getList } from "services";
import { Product, Location } from "models";
import { Workflow, WorkflowItem } from "models/Workflow";
import { toast } from "react-toastify";
import { Loading } from "components/Loading";
import { Close } from "@material-ui/icons";
import { DisplayPrice } from "components/DisplayPrice";
import { PriceInputFormat } from "components/PriceInutFormat";
import { update } from "services";

interface ProductPormProps {
  data?: Workflow;
  onSave: (data: Workflow) => void;
}

const TagForm = ({ data, onSave }: ProductPormProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(data?.name || "");
  const [costs, setCosts] = useState(data?.costs || "");
  const [toItem, setToItem] = useState<WorkflowItem | null>(
    data?.toItem || null
  );
  const [fromItems, setFromItems] = useState<WorkflowItem[]>(
    data?.fromItems || []
  );
  const [location, setLocation] = useState<Location | null>(
    data?.location || null
  );
  const [totalCosts, setTotalCosts] = useState(0);
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [searchItemText, setSearchItemText] = useState("");
  const [listLocations, setListLocations] = useState<Location[]>([]);
  const { t } = useTranslation("common");

  const loadData = async () => {
    setLoading(true);
    const res = await Promise.all([getList("item"), getList("location")]).catch(
      (e) => {
        toast.error(t("can't load data"));
      }
    );
    if (res) {
      setListProducts(res[0]?.data);
      setListLocations(res[1].data);
    }
    setLoading(false);
  };

  const onChangeName = (e: any) => {
    setName(e.target.value);
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    if (toItem) {
      const updateData = {
        toItem,
        name,
        location,
        fromItems,
        costs: parseInt(`${costs}`),
        totalCosts,
      };
      // if (!toItem.item.inputPrice) {
      //   update("item", {
      //     _id: toItem.item._id,
      //     inputPrice: totalCosts,
      //   });
      // }
      onSave(updateData);
    }
  };

  const onSelectToItem = (product: Product | null) => {
    if (product) {
      setToItem({
        item: product,
        quantily: 1,
        totalPrice: parseInt(`${product.inputPrice || product.price}`, 10),
      });
    }
  };
  const onSelectFromItem = (product: Product | null) => {
    if (product) {
      const filtered = fromItems.filter(
        (item) => item.item._id === product._id
      );
      if (filtered.length === 0) {
        const item: WorkflowItem = {
          item: product,
          quantily: 1,
        };
        setFromItems([...fromItems, item]);
      }
    }
  };

  const onChangeQuantily = (index: number, value: number) => {
    if (value < 0) value = 0;
    const newFromItems = [...fromItems];
    newFromItems[index].quantily = value;
    setFromItems(newFromItems);
  };

  const removeFromItem = (index: number) => {
    const newFromItems = [...fromItems];
    newFromItems.splice(index, 1);
    setFromItems(newFromItems);
  };

  const calculateTotal = () => {
    let tmpTotal = 0;
    fromItems.forEach((item) => {
      const product = item.item;
      const itemTotal =
        item.quantily * parseInt(`${product.inputPrice || product.price}`);
      item.totalPrice = itemTotal;
      tmpTotal += itemTotal;
    });
    tmpTotal += parseInt(`${costs}`, 10);
    setTotalCosts(tmpTotal);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [fromItems, costs]);

  if (loading) {
    return <Loading />;
  }
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="name"
            label={t("name")}
            value={name}
            onChange={onChangeName}
            fullWidth={true}
            variant="outlined"
          />
        </Grid>
        {/* <Grid item xs={12} sm={12}>
          <TextField
            required={true}
            id="costs"
            label={t("costs")}
            value={costs}
            onChange={(e) => setCosts(e.target.value)}
            fullWidth={true}
            variant="outlined"
            InputProps={{
              inputComponent: PriceInputFormat,
            }}
          />
        </Grid> */}
        <Grid item xs={12} sm={12}>
          <Autocomplete
            id="location"
            options={listLocations}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) => `${option.name}`}
            value={location}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("factory")}
                variant="outlined"
                fullWidth={true}
                required={true}
              />
            )}
            onChange={(e: any, value: Location | null) => setLocation(value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <Autocomplete
            id="selectItem"
            options={listProducts}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) =>
              `${option.name} - ${option.tags
                ?.map((tag) => tag.name)
                .join(", ")}`
            }
            value={toItem?.item}
            renderInput={(params) => (
              <TextField
                {...params}
                label={`${t("product")} ${t("need")} ${t("produce")}`}
                variant="outlined"
                fullWidth={true}
                required={true}
              />
            )}
            onChange={(e: any, value: Product | null) => onSelectToItem(value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("name")}</TableCell>
                  <TableCell>{t("tag")}</TableCell>
                  <TableCell>{t("quantily")}</TableCell>
                  <TableCell></TableCell>
                  {/* <TableCell></TableCell> */}
                </TableRow>
              </TableHead>
              <TableBody>
                {fromItems.map((item, index) => (
                  <TableRow key={item.item._id}>
                    <TableCell component="th" scope="row">
                      {item.item.name}
                    </TableCell>
                    <TableCell>
                      {item.item.tags?.map((tag) => tag.name).join(", ")}
                    </TableCell>
                    <TableCell>
                      <TextField
                        id="standard-number"
                        label=""
                        type="number"
                        variant="outlined"
                        InputLabelProps={{
                          shrink: true,
                        }}
                        value={item.quantily}
                        onChange={(e) =>
                          onChangeQuantily(index, parseFloat(e.target.value))
                        }
                      />
                    </TableCell>
                    {/* <TableCell>
                      <DisplayPrice value={item.totalPrice || 0} />
                    </TableCell> */}
                    <TableCell>
                      <IconButton
                        aria-label="remove"
                        component="span"
                        onClick={() => removeFromItem(index)}
                      >
                        <Close color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {/* <TableRow key={"total"}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <p>{t("costs")}</p>
                    <p className={classes.totalText}>{t("total")}</p>
                  </TableCell>
                  <TableCell>
                    <p>
                      <DisplayPrice value={costs || 0} />
                    </p>
                    <p className={classes.totalText}>
                      <DisplayPrice value={totalCosts || 0} />
                    </p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow> */}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
        <Grid item xs={12} sm={12}>
          <Autocomplete
            id="selectItem"
            options={listProducts}
            inputValue={searchItemText}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) =>
              `${option.name} - ${option.tags
                ?.map((tag) => tag.name)
                .join(", ")}`
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("add material")}
                variant="outlined"
                fullWidth={true}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  setSearchItemText(e.target.value);
                }}
              />
            )}
            onChange={(e: any, value: Product | null) =>
              onSelectFromItem(value)
            }
          />
        </Grid>
      </Grid>

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
