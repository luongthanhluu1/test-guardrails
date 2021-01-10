import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";

import { ColorBox } from "components/Color";
import { Status, TagType } from "models";
import { useListData } from "hooks/useListData";
import { useFormatDate } from "hooks/useFormatDate";
import { DisplayPrice } from "components/DisplayPrice";
import { StatusText } from "components/Status";

export const name = "order";

const TagList = () => {
  const { t } = useTranslation("common");
  const headers = [
    {
      field: "date",
      headerName: t("createdAt"),
      flex: 1,
      width: 200,
      valueGetter: (params: CellParams) => {
        return useFormatDate(`${params.value}`);
      },
    },
    {
      field: "type",
      headerName: t("type"),
      flex: 1,
      width: 200,
      valueGetter: (params: CellParams) => {
        return t(`type ${params.value}`);
      },
    },
    {
      field: "status",
      headerName: t("status"),
      flex: 1,
      width: 200,
      renderCell: (param: CellParams) => {
        return (
          <StatusText status={(param.value as Status) || Status.Waiting} />
        );
      },
    },
    {
      field: "costs",
      headerName: t("costs"),
      flex: 1,
      // width: 300,
      renderCell: (params: CellParams) => {
        return <DisplayPrice value={`${params.value || ""}`} />;
      },
    },
    {
      field: "promo",
      headerName: t("promo"),
      flex: 1,
      // width: 300,
      renderCell: (params: CellParams) => {
        return <DisplayPrice value={`${params.value || ""}`} />;
      },
    },
    {
      field: "totalPrice",
      headerName: t("total"),
      flex: 1,
      width: 200,
      renderCell: (params: CellParams) => {
        return <DisplayPrice value={`${params.value || ""}`} />;
      },
    },
  ];
  const viewable = true;
  const unableDelete = true;
  const { Render } = useListData({
    name,
    tableHeaders: headers,
    viewable,
    unableDelete,
  });
  return Render;
};
export default TagList;
