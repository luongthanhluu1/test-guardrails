import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";
import { Check } from "@material-ui/icons";

import { useListData } from "hooks/useListData";

export const name = "contact";

const List = () => {
  const { t } = useTranslation("common");
  const headers = [
    { field: "name", headerName: t("name"), flex: 2, width: 300 },
    { field: "address", headerName: t("address"), flex: 2, width: 300 },
    { field: "phone", headerName: t("phone"), flex: 2, width: 300 },
    // {
    //   field: "isPartner",
    //   headerName: t("warehouse"),
    //   flex: 1,
    //   width: 100,
    //   renderCell: (params: CellParams) => {
    //     if (params.value) {
    //       return <Check color="primary" />;
    //     }
    //     return <></>;
    //   },
    // },
    // {
    //   field: "isCustomer",
    //   headerName: t("customer"),
    //   flex: 1,
    //   width: 200,
    //   renderCell: (params: CellParams) => {
    //     if (params.value) {
    //       return <Check color="primary" />;
    //     }
    //     return <></>;
    //   },
    // },
    // {
    //   field: "isDeliver",
    //   headerName: t("deliver"),
    //   flex: 1,
    //   width: 200,
    //   renderCell: (params: CellParams) => {
    //     if (params.value) {
    //       return <Check color="primary" />;
    //     }
    //     return <></>;
    //   },
    // },
  ];
  const { Render } = useListData({
    name,
    tableHeaders: headers,
    viewable: true,
  });
  return Render;
};
export default List;
