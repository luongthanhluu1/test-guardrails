import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";

import { ColorBox } from "components/Color";
import { TagType } from "models";
import { useListData } from "hooks/useListData";

export const name = "tag";

const TagList = () => {
  const { t } = useTranslation("common");
  const headers = [
    { field: "name", headerName: t("name"), flex: 1, width: 300 },
    {
      field: "value",
      headerName: t("value"),
      flex: 1,
      width: 300,
      renderCell: (params: CellParams) => {
        if (params.row.type === TagType.COLOR) {
          return <ColorBox color={`${params.value}`} />;
        }
        return <span>{params.value}</span>;
      },
    },
    {
      field: "type",
      headerName: t("type"),
      flex: 1,
      width: 300,
      valueGetter: (param: CellParams) => {
        return t(`${param.value}`);
      },
    },
  ];
  const { Render } = useListData({ name, tableHeaders: headers });
  return Render;
};
export default TagList;
