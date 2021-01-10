import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";

import { useListData } from "hooks/useListData";
import { DisplayPrice } from "components/DisplayPrice";

export const name = "workflow";

const TagList = () => {
  const { t } = useTranslation("common");
  const headers = [
    { field: "name", headerName: t("name"), flex: 1, width: 300 },
    {
      field: "toItem",
      headerName: t("product"),
      flex: 1,
      width: 300,
      valueGetter: (params: CellParams) => {
        return params.row.toItem?.item?.name;
      },
    },
    {
      field: "costs",
      headerName: t("costs"),
      flex: 1,
      width: 300,
      renderCell: (params: CellParams) => {
        return <DisplayPrice value={`${params.value || 0}`} />;
      },
    },
  ];
  const { Render } = useListData({ name, tableHeaders: headers });
  return Render;
};
export default TagList;
