import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";
import { Check } from "@material-ui/icons";

import { useListData } from "hooks/useListData";

export const name = "location";

const List = () => {
  const { t } = useTranslation("common");
  const headers = [
    { field: "name", headerName: t("name"), flex: 2, width: 300 },
    { field: "address", headerName: t("address"), flex: 2, width: 300 },
    {
      field: "isWarehouse",
      headerName: t("warehouse"),
      flex: 1,
      width: 100,
      renderCell: (params: CellParams) => {
        if (params.value) {
          return <Check color="primary" />;
        }
        return <></>;
      },
    },
    {
      field: "isFactory",
      headerName: t("factory"),
      flex: 1,
      width: 100,
      renderCell: (params: CellParams) => {
        if (params.value) {
          return <Check color="primary" />;
        }
        return <></>;
      },
    },
    {
      field: "isSupplier",
      headerName: t("supplier"),
      flex: 1,
      width: 200,
      renderCell: (params: CellParams) => {
        if (params.value) {
          return <Check color="primary" />;
        }
        return <></>;
      },
    },
    // {
    //   field: "unitPrice",
    //   headerName: t("unitPrice"),
    //   flex: 1,
    //   width: 200,
    // },
    {
      field: "wastePercent",
      headerName: t("wastePercent"),
      flex: 1,
      width: 200,
    },
  ];
  const { Render } = useListData({ name, tableHeaders: headers });
  return Render;
};
export default List;
