import React, { ChangeEvent, FC, useEffect, useState } from "react";
import {
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@material-ui/core";
import useTranslation from "next-translate/useTranslation";

import { Tag as TagComponent } from "components/Tag";
import { Color } from "components/Color";
import { OrderItem, Tag, TagType, Type, Warehouse } from "models";
import { Autocomplete } from "@material-ui/lab";

import { useStyles } from "../styles";
import { getList } from "services";
import { PriceInputFormat } from "components/PriceInutFormat";
import { DisplayPrice } from "components/DisplayPrice";
import { Close } from "@material-ui/icons";
import { CacheWorkflows } from "../Form";

interface TableItemProps {
  orderItems: OrderItem[];
  onItemsChange: (items: OrderItem[]) => void;
  requireItems: OrderItem[];
  onRequireItemsChange: (items: OrderItem[]) => void;
  listRemainingProducts: Warehouse[];
  onSelectRemainingProduct?: (warehouse: Warehouse) => void;
  type: Type;
  costs: number | string;
  promo: number | string;
  waste: number | string;
  total: number;
  workflows: CacheWorkflows;
}
const REQUIRE_ITEM = "requireItem";

export const TableItem: FC<TableItemProps> = ({
  orderItems,
  onItemsChange,
  requireItems,
  onRequireItemsChange,
  listRemainingProducts,
  onSelectRemainingProduct,
  type,
  costs,
  promo,
  waste,
  total,
  workflows,
}) => {
  const classes = useStyles();
  const { t } = useTranslation("common");

  const [autocompleteTagValue, setAutocompleteTagValue] = useState("");
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [colorList, setColorList] = useState<Tag[]>([]);

  const loadData = () => {
    getList("tag").then((res) => {
      setTagsList(res.data.filter((item: Tag) => item.type === TagType.TAG));
      setColorList(res.data.filter((item: Tag) => item.type === TagType.COLOR));
    });
  };

  const onSelectColor = (itemIndex: number, color: Tag | null) => {
    const newOrderItems = [...orderItems];
    newOrderItems[itemIndex].color = color;
    onItemsChange(newOrderItems);
  };

  const removeColor = (itemIndex: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems[itemIndex].color = null;
    onItemsChange(newOrderItems);
  };

  const onSelectTag = (itemIndex: number, tag: Tag | null) => {
    // setTimeout(() => setAutocompleteTagValue(""));
    const newOrderItems = [...orderItems];
    if (tag) {
      const filterd = newOrderItems[itemIndex]?.tags?.filter(
        (item) => item.value === tag.value
      );
      if (!filterd || filterd?.length === 0) {
        newOrderItems[itemIndex].tags = [
          ...(newOrderItems[itemIndex].tags || []),
          tag,
        ];
      }
      onItemsChange(newOrderItems);
    }
  };

  const removeTag = (itemIndex: number, tagIndex: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems[itemIndex].tags?.splice(tagIndex, 1);
    onItemsChange(newOrderItems);
  };

  const onChangeQuantily = (index: number, value: number, type?: string) => {
    if (value < 0) value = 0;
    const isRequireItem = type === REQUIRE_ITEM;
    const newItems = isRequireItem ? [...requireItems] : [...orderItems];
    newItems[index].quantily = value;
    isRequireItem ? onRequireItemsChange(newItems) : onItemsChange(newItems);
  };

  const onChangePrice = (
    index: number,
    value: number | string,
    type?: string
  ) => {
    const isRequireItem = type === REQUIRE_ITEM;
    const newItems = isRequireItem ? [...requireItems] : [...orderItems];
    newItems[index].price = value;
    isRequireItem ? onRequireItemsChange(newItems) : onItemsChange(newItems);
  };

  const onChangeInputPrice = (
    index: number,
    value: number | string,
    type?: string
  ) => {
    const isRequireItem = type === REQUIRE_ITEM;
    const newItems = isRequireItem ? [...requireItems] : [...orderItems];
    newItems[index].inputPrice = value;
    isRequireItem ? onRequireItemsChange(newItems) : onItemsChange(newItems);
  };

  const removeOrderItem = (index: number) => {
    const newOrderItems = [...orderItems];
    newOrderItems.splice(index, 1);
    onItemsChange(newOrderItems);
  };

  const removeRequireItem = (index: number) => {
    const newItems = [...requireItems];
    if (!newItems[index].required) {
      newItems.splice(index, 1);
      onRequireItemsChange(newItems);
    }
  };

  const onSelectPackage = (itemIndex: number, warehouse: Warehouse | null) => {
    if (warehouse) {
      const newItems = [...requireItems];
      newItems[itemIndex].packageNo = warehouse.packageNo;
      newItems[itemIndex].warehouseId = warehouse._id;
      newItems[itemIndex].inputPrice = warehouse.inputPrice;
      newItems[itemIndex].color = warehouse.item.color;
      newItems[itemIndex].tags = warehouse.item.tags;
      console.log(newItems[itemIndex], warehouse);
      onRequireItemsChange(newItems);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <TableContainer>
      <Table>
        {(type === Type.Output || type === Type.Produce) && (
          <TableHead>
            <TableRow>
              <TableCell>{t("name")}</TableCell>
              <TableCell>{t("color")}</TableCell>
              <TableCell>{t("tag")}</TableCell>
              <TableCell>{t("quantily")}</TableCell>
              <TableCell>{t("unitPrice")}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableBody>
          {orderItems.map((item, index) => (
            <TableRow key={item._id}>
              <TableCell component="th" scope="row">
                {item.name}
              </TableCell>
              <TableCell>
                {/* {item.tags?.map((tag) => tag.name).join(", ")} */}
                <>
                  {item.color && (
                    <div className={classes.listTags}>
                      <TagComponent onClickRemove={() => removeColor(index)}>
                        <Color item={item.color} />
                      </TagComponent>
                    </div>
                  )}
                  <Autocomplete
                    id="selectColor"
                    options={colorList}
                    // inputValue={autocompleteColorValue}
                    value={item.color}
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
                        // onChange={(
                        //   e: ChangeEvent<
                        //     HTMLTextAreaElement | HTMLInputElement
                        //   >
                        // ) => {
                        //   setAutocompleteColorValue(e.target.value);
                        // }}
                      />
                    )}
                    onChange={(e, value) => onSelectColor(index, value)}
                  />
                </>
              </TableCell>
              <TableCell>
                {/* {item.tags?.map((tag) => tag.name).join(", ")} */}
                <>
                  <div className={classes.listTags}>
                    {item.tags?.map((tag, i) => {
                      if (tag.type === TagType.COLOR) {
                        return null;
                      }
                      return (
                        <TagComponent
                          key={tag.value}
                          onClickRemove={() => removeTag(index, i)}
                        >
                          <span>{tag.value}</span>
                        </TagComponent>
                      );
                    })}
                  </div>
                  <Autocomplete
                    id="selectType"
                    options={tagsList}
                    inputValue={autocompleteTagValue}
                    value={null}
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
                    onChange={(e: any, value: Tag | null) =>
                      onSelectTag(index, value)
                    }
                  />
                </>
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
              <TableCell>
                {(type === Type.Input || type === Type.Produce) && (
                  <TextField
                    id="standard-number"
                    label=""
                    variant="outlined"
                    InputProps={{
                      inputComponent: PriceInputFormat,
                    }}
                    value={item.inputPrice}
                    onChange={(e) => onChangeInputPrice(index, e.target.value)}
                  />
                )}
                {type === Type.Output && (
                  <TextField
                    id="standard-number"
                    label=""
                    variant="outlined"
                    value={item.price}
                    onChange={(e) => onChangePrice(index, e.target.value)}
                    InputProps={{
                      inputComponent: PriceInputFormat,
                    }}
                  />
                )}
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
          {((type === Type.Produce && requireItems.length > 0) ||
            type === Type.Move) && (
            <>
              {type === Type.Produce && requireItems.length > 0 && (
                <TableRow>
                  <TableCell className={classes.requireText}>
                    {t("material require")}
                  </TableCell>
                </TableRow>
              )}
              <TableRow key={"total"}>
                <TableCell>{t("name")}</TableCell>
                <TableCell>{t("tag")}</TableCell>
                <TableCell>{t("packageNo")}</TableCell>
                <TableCell>{t("quantily")}</TableCell>
                <TableCell>
                  {type === Type.Produce ? t("wastePercent") : t("unitPrice")}
                </TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </>
          )}
          {requireItems &&
            requireItems.map((item, index) => (
              <TableRow
                key={item.warehouseId || item._id}
                className={type === Type.Produce ? classes.requireItem : ""}
              >
                <TableCell component="th" scope="row">
                  {item.name}
                </TableCell>
                <TableCell>
                  {[...(item.tags || []), item.color]
                    ?.map((tag) => tag?.name)
                    .join(", ")}
                </TableCell>
                <TableCell>
                  <Autocomplete
                    id="selectItem"
                    options={listRemainingProducts.filter((warehouse) => {
                      return warehouse.item._id === item._id;
                    })}
                    inputValue={item.packageNo}
                    autoHighlight
                    fullWidth={true}
                    getOptionLabel={(option) =>
                      `${option.packageNo} - (${t("{{count}} items remaining", {
                        count: option.count?.toString() || "",
                      })})`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("packageNo")}
                        variant="outlined"
                        fullWidth={true}
                        required={true}
                        disabled={type !== Type.Produce}
                      />
                    )}
                    onChange={(e: any, value: Warehouse | null) =>
                      onSelectPackage(index, value)
                    }
                  />
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
                      onChangeQuantily(
                        index,
                        parseFloat(e.target.value),
                        REQUIRE_ITEM
                      )
                    }
                  />
                </TableCell>
                <TableCell>
                  {type === Type.Move ? null : type !== Type.Produce ? (
                    <TextField
                      id="standard-number"
                      label=""
                      variant="outlined"
                      value={item.price}
                      onChange={(e) =>
                        onChangePrice(index, e.target.value, REQUIRE_ITEM)
                      }
                      InputProps={{
                        inputComponent: PriceInputFormat,
                      }}
                    />
                  ) : (
                    `${item.wastePercent || 0}%`
                  )}
                </TableCell>
                <TableCell>
                  <DisplayPrice value={item.totalPrice || 0} />
                </TableCell>
                <TableCell>
                  {!item.required && (
                    <IconButton
                      aria-label="remove"
                      component="span"
                      onClick={() => removeRequireItem(index)}
                    >
                      <Close color="error" />
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          <TableRow key={"total"}>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>
              <p>{t("costs")}</p>
              <p>{t("promo")}</p>
              {type === Type.Produce && <p>{t("waste")}</p>}
              <p className={classes.totalText}>{t("total")}</p>
            </TableCell>
            <TableCell>
              <p>
                <DisplayPrice value={costs || 0} />
              </p>
              <p>
                <DisplayPrice value={promo || 0} />
              </p>
              {type === Type.Produce && (
                <p>
                  <DisplayPrice value={waste || 0} />
                </p>
              )}
              <p className={classes.totalText}>
                <DisplayPrice value={total || ""} />
              </p>
            </TableCell>
            <TableCell></TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableItem;
