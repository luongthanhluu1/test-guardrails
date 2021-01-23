import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@material-ui/core";
import { Close, SendTwoTone } from "@material-ui/icons";
import React, { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
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
import { Tag as TagComponent } from "components/Tag";
import { Workflow } from "models/Workflow";
import { getByItemIdAndLocationId } from "services/workflow";

import { useStyles } from "./styles";
import { Warehouse } from "models/Warehouse";
import { Color } from "components/Color";
import { TableItem } from "./Form/TableItem";

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
  packageNo?: string;
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

export interface CacheWorkflows {
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
  // console.log(requireItems, data?.requireItems);
  const [total, setTotal] = useState(data?.totalPrice || 0);
  const [isWarehouse, setIsWarehouse] = useState(data?.isWarehouse || true);
  const [costs, setCosts] = useState(data?.costs || "");
  const [promo, setPromo] = useState(data?.promo || "");
  const [waste, setWaste] = useState(0);
  const [profit, setProfit] = useState(0);
  const [note, setNote] = useState(data?.note || "");
  const [packageNo, setPackageNo] = useState(data?.packageNo || "");
  const [listLocations, setListLocations] = useState<Location[]>([]);
  const [listFactories, setListFactories] = useState<Location[]>([]);
  const [listContacts, setListContacts] = useState<Contact[]>([]);
  const [listProducts, setListProducts] = useState<Product[]>([]);
  const [listRemainingProducts, setListRemainingProducts] = useState<
    Warehouse[]
  >([]);
  const [workflows, setWorkflows] = useState<CacheWorkflows>({});
  const [errorMessage, setErrorMessage] = useState("");

  const { t } = useTranslation("common");

  const onSubmit = (e: any) => {
    e.preventDefault();
    const updateData: PostData = {
      type,
      status,
      locationFrom: locationTo?._id || null,
      locationTo: locationTo?._id || null,
      customer: customer?._id || null,
      date: date?.toISOString(),
      items: orderItems,
      requireItems,
      note,
      costs: parseInt(`${costs}`, 10),
      packageNo: packageNo
        ? packageNo
        : moment(date).format("DDMMYYYY-HH:MM:SS"),
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
      getList("warehouse"),
      loadAllWorkflow(),
    ]).catch((e) => {
      toast.error(t("can't load data"));
    });
    if (res) {
      setListLocations(
        res[0].data.filter(
          (item: Location) => item.isFactory || item.isWarehouse
        ) || []
      );
      setListFactories(
        res[0].data.filter((item: Location) => item.isFactory) || []
      );
      setListContacts(res[1].data || []);
      setListProducts(res[2].data || []);
      setListRemainingProducts(res[3].data || []);
      if (res[4]) {
        setWorkflows(res[4]);
      }
    }
    setLoading(false);
  };

  const onSelectProduct = (product: Product | null) => {
    if (type === Type.Produce && orderItems.length > 0) {
      return;
    }
    if (product) {
      // const filtered = orderItems.filter((item) => item._id === product._id);
      // if (filtered.length === 0) {
      const item: OrderItem = {
        _id: product?._id,
        name: product?.name || "",
        tags: product?.tags,
        price: type === Type.Produce ? 0 : product.price || 0,
        inputPrice:
          type === Type.Produce ? 0 : product.inputPrice || product.price || 0,
        quantily: 1,
      };
      setOrderItems([...orderItems, item]);
      // }
      if (type === Type.Produce && product._id) {
        loadWorkflow(product._id);
      }
    }
  };

  const onSelectRemainingProduct = (warehouse: Warehouse | null) => {
    if (warehouse) {
      const filtered = requireItems.filter((item) => {
        if (item.warehouseId) {
          return item.warehouseId === warehouse._id;
        } else {
          return item._id === warehouse.item._id;
        }
      });
      console.log(warehouse);
      if (filtered.length === 0) {
        const item: OrderItem = {
          _id: warehouse.item?._id,
          name: warehouse.item?.name || "",
          tags: warehouse.item?.tags,
          price: warehouse.item.price || 0,
          packageNo: warehouse.packageNo,
          warehouseId: warehouse._id,
          inputPrice: warehouse.inputPrice || warehouse.item.price || 0,
          quantily: 1,
        };
        setRequireItems([...requireItems, item]);
      }
    }
  };

  const loadAllWorkflow = async () => {
    if (type !== Type.Produce) {
      return;
    }
    const loadAll: any[] = [];
    const newWorkflows = { ...workflows };
    if (locationFrom) {
      orderItems.map((item) => {
        if (item._id && !newWorkflows[item._id || ""]) {
          loadAll.push(
            getByItemIdAndLocationId(item._id, locationFrom._id || "").then(
              (res) => {
                newWorkflows[item._id || ""] = res?.data;
              }
            )
          );
        }
      });
      await Promise.all(loadAll);
    }
    return newWorkflows;
  };

  const loadWorkflow = async (itemId: string) => {
    const newWorkflows = { ...workflows };
    if (!newWorkflows[itemId] && locationFrom) {
      const res = await getByItemIdAndLocationId(
        itemId,
        locationFrom._id || ""
      ).catch((e) => {
        toast.error(t("can't load {{name}} data", { name: t("workflow") }));
      });
      newWorkflows[itemId] = res?.data;
    }
    setWorkflows(newWorkflows);
  };

  const calculateTotal = () => {
    if (type === Type.Move) {
      return;
    }
    let tmpTotal = 0;
    let tmpProfit = 0;
    const items =
      type === Type.Produce || type === Type.Input ? orderItems : requireItems;
    items.forEach((item) => {
      let itemTotal = 0;
      let itemInputTotal = 0;
      const quantily = item.quantily || 0;
      if (type === Type.Input || type === Type.Produce) {
        itemTotal =
          quantily * parseInt(`${item.inputPrice || item.price || 0}`);
      }
      if (type === Type.Output) {
        itemTotal = quantily * parseInt(`${item.price || 0}`, 10);
        // to calculate profit
        itemInputTotal =
          quantily * parseInt(`${item.inputPrice || item.price || 0}`, 10);
      }
      // if (type === Type.Produce) {
      //   itemTotal = item.quantily * (workflows[item?._id || ""]?.costs || 0);
      // }
      item.totalPrice = itemTotal;
      tmpTotal += itemTotal;
      tmpProfit += itemTotal - itemInputTotal;
    });

    if (type !== Type.Output) {
      tmpTotal += parseInt(`${costs || 0}`, 10);
    } else {
      tmpProfit -= parseInt(`${costs || 0}`, 10);
    }

    if (promo) {
      tmpTotal -= parseInt(`${promo}`, 10);
      tmpProfit -= parseInt(`${promo}`, 10);
    }

    setTotal(tmpTotal);
    setProfit(tmpProfit);
  };

  const clearData = () => {
    setOrderItems([]);
    setRequireItems([]);
    setWorkflows({});
  };

  const onChangeType = (e: any) => {
    const newType = e.target.value;
    setType(newType);
    clearData();
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

  const calculateWasteTotal = () => {
    if (type !== Type.Produce) {
      return;
    }
    let totalWaste = 0;
    requireItems.forEach((item) => {
      const wastePercent = item.wastePercent || 0;
      const quantily = item.quantily || 0;
      const inpuPrice = item.inputPrice || 0;
      totalWaste +=
        ((quantily * wastePercent) / 100) * parseFloat(`${inpuPrice}`);
    });
    setWaste(totalWaste);
  };

  const onChangeLocationFrom = (value: Location | null) => {
    setLocationFrom(value);
    if (type === Type.Produce) {
      clearData();
    }
  };

  useEffect(() => {
    loadConfigData();
  }, []);

  useEffect(() => {
    loadAllWorkflow();
  }, [orderItems, type]);

  useEffect(() => {
    calculateTotal();
  }, [orderItems, requireItems, promo, costs, type, workflows]);

  useEffect(() => {
    calculateWasteTotal();
  }, [requireItems]);

  useEffect(() => {
    let newErrorMessage = "";
    let totalWaste = 0;
    // if (type === Type.Move) {
    //   const newRequireItem = [...orderItems];
    //   newErrorMessage = "";
    //   setRequireItems(newRequireItem);
    // }
    if (type === Type.Produce && requireItems && requireItems.length === 0) {
      let newRequireItem: OrderItem[] = [];
      if (orderItems && orderItems.length) {
        let isValid = true;
        orderItems.forEach((item) => {
          if (item._id) {
            if (!workflows[item._id]) {
              isValid = false;
            } else {
              const workflow = workflows[item._id];
              const wastePercent: number = 0; //locationFrom?.wastePercent || 0;
              // const quantily = wastePercent
              //   ? (item.quantily * 100) / (100 - wastePercent)
              //   : item.quantily;
              // totalWaste +=
              //   (quantily - item.quantily) * parseInt(`${item.inputPrice}`, 10);
              workflow.fromItems?.forEach((fromItem) => {
                const requireItem: OrderItem = {
                  ...fromItem.item,
                  quantily: 0,
                  required: true,
                  // quantily: parseFloat(
                  //   (fromItem.quantily * quantily).toFixed(2)
                  // ),
                };
                newRequireItem.push(requireItem);
              });
            }
          }
        });
        if (!isValid) {
          newErrorMessage = "ERR_NOT_ENOUGHT_WORKFLOW_INFO";
        }
      }
      setRequireItems(newRequireItem);
      // setWaste(Math.round(totalWaste));
    }
    if (type === Type.Input || type === Type.Output) {
      newErrorMessage = "";
      // setRequireItems([]);
    }
    setErrorMessage(newErrorMessage);
  }, [orderItems, type, workflows]);

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
        {type === Type.Output && (
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
        )}
        {type === Type.Produce && (
          <Grid item xs={12} sm={12}>
            <Autocomplete
              id="locationFrom"
              options={listFactories}
              autoHighlight
              fullWidth={true}
              getOptionLabel={(option) => `${option.name}`}
              value={locationFrom}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={t("factory")}
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
        )}
      </Grid>

      {type === Type.Produce && !locationFrom ? null : (
        <>
          <Grid container spacing={4} className={classes.group}>
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
            {(type === Type.Produce ||
              type === Type.Input ||
              type === Type.Move) &&
              isWarehouse && (
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
              )}

            <Grid item xs={12} sm={12}>
              <TextField
                id="packageNo"
                label={t("packageNo")}
                value={packageNo}
                onChange={(e) => setPackageNo(e.target.value)}
                fullWidth={true}
                variant="outlined"
              />
            </Grid>
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
            <TableItem
              orderItems={orderItems}
              onItemsChange={setOrderItems}
              requireItems={requireItems}
              onRequireItemsChange={setRequireItems}
              listRemainingProducts={listRemainingProducts}
              onSelectRemainingProduct={onSelectRemainingProduct}
              costs={costs}
              promo={promo}
              total={total}
              type={type}
              waste={waste}
              workflows={workflows}
            />
          </Grid>
          <Grid container spacing={2} className={classes.group}>
            <Grid item xs={12} sm={12}>
              {(type === Type.Move ||
                type === Type.Output ||
                (type === Type.Produce && orderItems.length >= 1)) && (
                <Autocomplete
                  id="selectItem"
                  options={listRemainingProducts}
                  inputValue={searchItemText}
                  value={null}
                  autoHighlight
                  fullWidth={true}
                  getOptionLabel={(option) =>
                    `${option.packageNo} - ${option.item?.name} - (${t(
                      "{{count}} items remaining",
                      {
                        count: option.count?.toString() || "",
                      }
                    )})`
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        type === Type.Produce
                          ? t("add material")
                          : t("add product")
                      }
                      variant="outlined"
                      fullWidth={true}
                      onChange={(
                        e: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
                      ) => {
                        setSearchItemText(e.target.value);
                      }}
                    />
                  )}
                  onChange={(e: any, value: Warehouse | null) =>
                    onSelectRemainingProduct(value)
                  }
                />
              )}
              {((type === Type.Produce && orderItems.length === 0) ||
                type === Type.Input) && (
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
                  value={null}
                  onChange={(e: any, value: Product | null) =>
                    onSelectProduct(value)
                  }
                />
              )}
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
                {errorMessage && (
                  <p className={classes.error}>{t(errorMessage)}</p>
                )}
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
        </>
      )}
    </form>
  );
};

export default Form;
