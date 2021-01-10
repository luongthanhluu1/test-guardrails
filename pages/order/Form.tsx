import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  TableContainer,
  TableHead,
  TableCell,
  TableRow,
  Table,
  TableBody,
  IconButton,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { Close, SendTwoTone } from "@material-ui/icons";
import React, { ChangeEvent, useEffect, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import { Autocomplete } from "@material-ui/lab";
import { KeyboardDatePicker } from "@material-ui/pickers";
import { MaterialUiPickersDate } from "@material-ui/pickers/typings/date";
import { toast } from "react-toastify";
import moment from "moment";

import { Tag, TagOptions, TagType } from "models/Tag";
import {
  Status,
  StatusOptions,
  Type,
  TypeOptions,
  Order,
  OrderItem,
} from "models/Order";
import { getById, getList } from "services";
import { Contact, Location, Product } from "models";
import { DisplayPrice } from "components/DisplayPrice";
import { Loading } from "components/Loading";
import { PriceInputFormat } from "components/PriceInutFormat";
import { Workflow } from "models/Workflow";
import { getByItemId } from "services/workflow";

import { useStyles } from "./styles";

interface PostData {
  type: Type;
  status: Status;
  locationFrom: string | null;
  locationTo: string | null;
  customer: string | null;
  date?: string;
  items: OrderItem[];
  requireItems?: OrderItem[];
  costs?: number;
  promo?: number;
  note?: string;
  totalPrice: number;
  profit: number;
  isWarehouse: boolean;
  waste?: number;
}

interface ProductPormProps {
  data?: Order;
  onSave: (data: PostData) => void;
  submiting?: boolean;
}

interface CacheWorkflows {
  [id: string]: Workflow;
}

const Form = ({ data, onSave, submiting }: ProductPormProps) => {
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(data?.type || Type.Input);
  const [status, setStatus] = useState(data?.status || Status.Approved);
  const [locationFrom, setLocationFrom] = useState(data?.locationFrom || null);
  const [locationTo, setLocationTo] = useState(data?.locationTo || null);
  const [date, setDate] = useState<MaterialUiPickersDate>(moment());
  const [searchItemText, setSearchItemText] = useState("");
  const [customer, setCustomer] = useState<Contact | null>(
    data?.customer || null
  );
  const [orderItems, setOrderItems] = useState<OrderItem[]>(data?.items || []);
  const [requireItems, setRequireItems] = useState<OrderItem[]>(
    data?.requireItems || []
  );
  const [total, setTotal] = useState(data?.totalPrice || 0);
  const [isWarehouse, setIsWarehouse] = useState(data?.isWarehouse || false);
  const [costs, setCosts] = useState(data?.costs || "");
  const [promo, setPromo] = useState(data?.promo || "");
  const [waste, setWaste] = useState(0);
  const [profit, setProfit] = useState(0);
  const [note, setNote] = useState(data?.note || "");
  const [listLocations, setListLocations] = useState<Location[]>([]);
  const [listWarehouses, setListWarehouses] = useState<Location[]>([]);
  const [listSupplier, setListSupplier] = useState<Location[]>([]);
  const [listFactory, setListFactory] = useState<Location[]>([]);
  const [listContacts, setListContacts] = useState<Contact[]>([]);
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [workflows, setWorkflows] = useState<CacheWorkflows>({});
  const [errorMessage, setErrorMessage] = useState("");

  const { t } = useTranslation("common");

  const onSubmit = (e: any) => {
    e.preventDefault();
    const updateData: PostData = {
      type,
      status,
      locationFrom: locationFrom?._id || null,
      locationTo: locationTo?._id || null,
      customer: customer?._id || null,
      date: date?.toISOString(),
      items: orderItems,
      requireItems,
      note,
      costs: parseInt(`${costs}`, 10),
      profit,
      promo: parseInt(`${promo}`, 10),
      totalPrice: total,
      isWarehouse,
      waste,
    };
    onSave(updateData);
  };

  const loadConfigData = async () => {
    setLoading(true);
    const res = await Promise.all([
      getList("location"),
      getList("contact"),
      getList("item"),
      loadAllWorkflow(),
    ]).catch((e) => {
      toast.error(t("can't load data"));
    });
    if (res) {
      setListSupplier(
        res[0].data.filter((item: Location) => item.isSupplier) || []
      );
      setListWarehouses(
        res[0].data.filter((item: Location) => item.isWarehouse) || []
      );
      setListFactory(
        res[0].data.filter((item: Location) => item.isFactory) || []
      );
      setListLocations(
        res[0].data.filter(
          (item: Location) => item.isFactory || item.isWarehouse
        ) || []
      );
      setListContacts(res[1].data || []);
      setListProducts(res[2].data || []);
      if (res[3]) {
        setWorkflows(res[3]);
      }
    }
    setLoading(false);
  };

  const onSelectProduct = (product: Product | null) => {
    if (product) {
      const filtered = orderItems.filter((item) => item._id === product._id);
      if (filtered.length === 0) {
        const item: OrderItem = {
          _id: product._id,
          name: product.name || "",
          tags: product.tags,
          price: product.price || 0,
          inputPrice: product.inputPrice || product.price || 0,
          quantily: 1,
        };
        setOrderItems([...orderItems, item]);
      }
      if (type === Type.Produce && product._id) {
        loadWorkflow(product._id);
      }
    }
  };

  const onChangeQuantily = (index: number, value: number) => {
    if (value < 1) value = 1;
    const newOrderItems = [...orderItems];
    newOrderItems[index].quantily = value;
    setOrderItems(newOrderItems);
  };

  const removeOrderItem = (index: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems.splice(index, 1);
    setOrderItems(newOrderItems);
  };

  const loadAllWorkflow = async () => {
    // if (type !== Type.Produce) {
    //   return;
    // }
    const loadAll: any[] = [];
    const newWorkflows = { ...workflows };
    orderItems.map((item) => {
      if (item._id) {
        loadAll.push(
          getByItemId(item._id).then((res) => {
            newWorkflows[item._id || ""] = res?.data;
          })
        );
      }
    });
    await Promise.all(loadAll);
    return newWorkflows;
  };

  const loadWorkflow = async (itemId: string) => {
    const newWorkflows = { ...workflows };
    if (!newWorkflows[itemId]) {
      const res = await getByItemId(itemId).catch((e) => {
        toast.error("can't load data");
      });
      newWorkflows[itemId] = res?.data;
    }
    setWorkflows(newWorkflows);
  };

  const calculateTotal = () => {
    let tmpTotal = 0;
    let tmpProfit = 0;
    orderItems.forEach((item) => {
      let itemTotal = 0;
      let itemInputTotal = 0;
      if (type === Type.Input) {
        itemTotal =
          item.quantily * parseInt(`${item.inputPrice || item.price}`);
      }
      if (type === Type.Output) {
        itemTotal = item.quantily * parseInt(`${item.price}`, 10);
        itemInputTotal =
          item.quantily * parseInt(`${item.inputPrice || item.price}`, 10);
      }
      if (type === Type.Produce) {
        itemTotal = item.quantily * (workflows[item?._id || ""]?.costs || 0);
      }
      item.totalPrice = itemTotal;
      tmpTotal += itemTotal;
      tmpProfit += itemTotal - itemInputTotal;
    });

    if (type !== Type.Output) {
      if (costs) {
        tmpTotal += parseInt(`${costs}`, 10);
        tmpProfit -= parseInt(`${costs}`, 10);
      }
      if (promo) {
        tmpProfit -= parseInt(`${promo}`, 10);
      }
    }
    // if (type === Type.Output) {
    //   if (costs) {
    //     tmpTotal -= parseInt(`${costs}`, 10);
    //   }
    // }
    if (promo) {
      tmpTotal -= parseInt(`${promo}`, 10);
    }
    setTotal(tmpTotal);
    setProfit(tmpProfit);
  };

  const onChangeType = (e: any) => {
    const newType = e.target.value;
    setType(newType);
    setLocationFrom(null);
    // if (newType === Type.Produce || newType === Type.Move) {
    //   setIsWarehouse(true);
    // }
  };

  const calCulateCosts = () => {
    let totalCosts = 0;
    orderItems.map((item) => {
      const id = item._id || "";

      if (workflows[id]) {
        totalCosts += workflows[id].costs;
      }
    });
    setCosts(`${totalCosts}`);
  };

  const onChangeLocationFrom = (value: Location | null) => {
    setLocationFrom(value);
    if (!locationTo) {
      if (type === Type.Produce) {
        setLocationTo(value);
      }
    }
  };

  useEffect(() => {
    loadConfigData();
  }, []);

  useEffect(() => {
    calculateTotal();
  }, [orderItems, promo, costs, type, workflows]);

  useEffect(() => {
    let newErrorMessage = "";
    let totalWaste = 0;
    if (type === Type.Move) {
      const newRequireItem = [...orderItems];
      newErrorMessage = "";
      setRequireItems(newRequireItem);
    }
    if (type === Type.Produce) {
      let newRequireItem: OrderItem[] = [];
      if (orderItems && orderItems.length) {
        let isValid = true;
        orderItems.forEach((item) => {
          if (item._id) {
            if (!workflows[item._id]) {
              isValid = false;
            } else {
              const workflow = workflows[item._id];
              const wastePercent: number = locationFrom?.wastePercent || 0;
              const quantily = wastePercent
                ? (item.quantily * 100) / (100 - wastePercent)
                : item.quantily;
              totalWaste +=
                (quantily - item.quantily) * parseInt(`${item.inputPrice}`, 10);
              workflow.fromItems?.forEach((fromItem) => {
                const requireItem: OrderItem = {
                  ...fromItem.item,
                  quantily: parseFloat(
                    (fromItem.quantily * quantily).toFixed(2)
                  ),
                };
                newRequireItem.push(requireItem);
              });
            }
          }
        });
        if (!isValid) {
          newErrorMessage = "NOT_ENOUGHT_WORKFLOW_INFO";
        }
      }
      setRequireItems(newRequireItem);
      setWaste(Math.round(totalWaste));
    }
    if (type === Type.Input || type === Type.Output) {
      newErrorMessage = "";
      setRequireItems([]);
    }
    setErrorMessage(newErrorMessage);
  }, [orderItems, type, workflows, locationFrom]);

  if (loading || submiting) {
    return <Loading />;
  }
  return (
    <form onSubmit={onSubmit}>
      <Grid container spacing={2} className={classes.group}>
        <Grid item xs={12} sm={12}>
          <FormControl variant="outlined" fullWidth={true}>
            <InputLabel id="type-label" required={true}>
              {t("type")}
            </InputLabel>
            <Select
              labelId="type-label"
              id="type"
              onChange={onChangeType}
              value={type}
              label={`${t("type")}}`}
              fullWidth={true}
              required={true}
            >
              {TypeOptions.map((option) => (
                <MenuItem value={option} key={option}>
                  {t("type " + option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      {(type === Type.Produce || type === Type.Input) && (
        <Grid container spacing={2} className={classes.group}>
          <Grid item xs={12} sm={12}>
            <Autocomplete
              id="locationFrom"
              options={type === Type.Produce ? listFactory : listSupplier}
              autoHighlight
              fullWidth={true}
              getOptionLabel={(option) => `${option.name}`}
              value={locationFrom}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={type === Type.Produce ? t("factory") : t("supplier")}
                  variant="outlined"
                  fullWidth={true}
                  required={true}
                />
              )}
              onChange={(e: any, value: Location | null) =>
                onChangeLocationFrom(value)
              }
            />
          </Grid>
        </Grid>
      )}
      {type === Type.Output && (
        <Grid container spacing={2} className={classes.group}>
          <Grid item xs={12} sm={12}>
            <Autocomplete
              id="customer"
              options={listContacts}
              autoHighlight
              fullWidth={true}
              getOptionLabel={(option) => `${option.name}`}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("customer")}
                  variant="outlined"
                  fullWidth={true}
                  required={true}
                />
              )}
              value={customer}
              onChange={(e: any, value: Contact | null) => setCustomer(value)}
            />
          </Grid>
        </Grid>
      )}
      <Grid container spacing={2} className={classes.group}>
        <Grid item xs={12} sm={12}>
          <FormControl variant="outlined" fullWidth={true}>
            <InputLabel id="status-label" required={true}>
              {t("status")}
            </InputLabel>
            <Select
              labelId="status-label"
              id="status"
              onChange={(e) => setStatus(e.target.value as Status)}
              label={`${t("status")}}`}
              value={status}
              fullWidth={true}
              required={true}
            >
              {StatusOptions.map((option) => (
                <MenuItem value={option} key={option}>
                  {t("status " + option)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControlLabel
            control={
              <Checkbox
                checked={isWarehouse}
                onChange={(e) => setIsWarehouse(e.target.checked)}
                name="isWarehouse"
                color="primary"
                // disabled={type === Type.Produce || type === Type.Move}
              />
            }
            label={t("manager warehouse")}
          />
        </Grid>
        {(type === Type.Output || type === Type.Move) && isWarehouse && (
          <Grid container spacing={2} className={classes.group}>
            <Grid item xs={12} sm={12}>
              <Autocomplete
                id="locationFrom"
                options={listLocations}
                autoHighlight
                fullWidth={true}
                getOptionLabel={(option) => `${option.name}`}
                value={locationFrom}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={t("location from")}
                    variant="outlined"
                    fullWidth={true}
                    required={true}
                  />
                )}
                onChange={(e: any, value: Location | null) =>
                  setLocationFrom(value)
                }
              />
            </Grid>
          </Grid>
        )}
        {(type === Type.Produce || type === Type.Input || type === Type.Move) &&
          isWarehouse && (
            <Grid container spacing={2} className={classes.group}>
              <Grid item xs={12} sm={12}>
                <Autocomplete
                  id="locationTo"
                  options={listLocations}
                  autoHighlight
                  fullWidth={true}
                  getOptionLabel={(option) => `${option.name}`}
                  value={locationTo}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={t("location to")}
                      variant="outlined"
                      fullWidth={true}
                      required={true}
                    />
                  )}
                  onChange={(e: any, value: Location | null) =>
                    setLocationTo(value)
                  }
                />
              </Grid>
            </Grid>
          )}

        <Grid item xs={12} sm={12}>
          <KeyboardDatePicker
            disableToolbar
            variant="inline"
            format="DD/MM/YYYY"
            margin="normal"
            id="date"
            label={t("date")}
            value={date}
            onChange={(date) => setDate(date)}
            KeyboardButtonProps={{
              "aria-label": "change date",
            }}
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} className={classes.group}>
        {orderItems && orderItems.length ? (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t("name")}</TableCell>
                  <TableCell>{t("tag")}</TableCell>
                  <TableCell>{t("quantily")}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderItems.map((item, index) => (
                  <TableRow key={item._id}>
                    <TableCell component="th" scope="row">
                      {item.name}
                    </TableCell>
                    <TableCell>
                      {item.tags?.map((tag) => tag.name).join(", ")}
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
                          onChangeQuantily(index, parseInt(e.target.value, 10))
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <DisplayPrice value={item.totalPrice || 0} />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        aria-label="remove"
                        component="span"
                        onClick={() => removeOrderItem(index)}
                      >
                        <Close color="error" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {requireItems.length > 0 && (
                  <TableRow>
                    <TableCell className={classes.requireText}>
                      {t("item require")}
                    </TableCell>
                  </TableRow>
                )}
                {requireItems &&
                  requireItems.map((item, index) => (
                    <TableRow key={item._id} className={classes.requireItem}>
                      <TableCell component="th" scope="row">
                        {item.name}
                      </TableCell>
                      <TableCell>
                        {item.tags?.map((tag) => tag.name).join(", ")}
                      </TableCell>
                      <TableCell>-{item.quantily}</TableCell>
                      <TableCell>
                        {/* <DisplayPrice value={item.totalPrice || 0} /> */}
                      </TableCell>
                      <TableCell>
                        {/* <IconButton
                        aria-label="remove"
                        component="span"
                        onClick={() => removeOrderItem(index)}
                      >
                        <Close color="error" />
                      </IconButton> */}
                      </TableCell>
                    </TableRow>
                  ))}
                <TableRow key={"total"}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <p>{t("costs")}</p>
                    <p>{t("promo")}</p>
                    <p>{t("waste")}</p>
                    <p className={classes.totalText}>{t("total")}</p>
                  </TableCell>
                  <TableCell>
                    <p>
                      <DisplayPrice value={costs || 0} />
                    </p>
                    <p>
                      <DisplayPrice value={promo || 0} />
                    </p>
                    <p>
                      <DisplayPrice value={waste || 0} />
                    </p>
                    <p className={classes.totalText}>
                      <DisplayPrice value={total || ""} />
                    </p>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        ) : null}
      </Grid>
      <Grid container spacing={2} className={classes.group}>
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
                label={t("add product")}
                variant="outlined"
                fullWidth={true}
                onChange={(
                  e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                ) => {
                  setSearchItemText(e.target.value);
                }}
              />
            )}
            onChange={(e: any, value: Product | null) => onSelectProduct(value)}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
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
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id="promo"
            label={t("promo")}
            value={promo}
            onChange={(e) => setPromo(e.target.value)}
            fullWidth={true}
            variant="outlined"
            InputProps={{
              inputComponent: PriceInputFormat,
            }}
          />
        </Grid>
        <Grid item xs={12} sm={12}>
          <TextField
            id="note"
            label={t("note")}
            multiline
            rows={4}
            variant="outlined"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth={true}
          />
        </Grid>
        {data?.status !== Status.Completed && (
          <Grid item xs={12} sm={12}>
            {errorMessage && <p className={classes.error}>{errorMessage}</p>}
            <FormControl variant="outlined" fullWidth={true}>
              <Button
                type="submit"
                color="primary"
                variant="contained"
                disabled={!!errorMessage}
              >
                {t("save")}
              </Button>
            </FormControl>
          </Grid>
        )}
      </Grid>
    </form>
  );
};

export default Form;
