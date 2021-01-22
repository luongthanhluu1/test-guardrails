import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";

import { ColorBox } from "components/Color";
import { Status, TagType } from "models";
import { useListData } from "hooks/useListData";
import { Tag } from "models/Tag";

export const name = "warehouse";

const TagList = () => {
  const { t } = useTranslation("common");
  const headers = [
    {
      field: "item",
      headerName: t("name"),
      flex: 1,
      width: 300,
      valueGetter: (params: CellParams) => {
        return `${params.row.item?.name}`;
      },
    },
    {
      field: "",
      headerName: t("tag"),
      flex: 1,
      width: 300,
      renderCell: (params: CellParams) => {
        const tags: Tag[] = params.row.item?.tags || [];
        return (
          <p>
            {tags?.map((tag, i) => {
              const style = {
                borderBottom: "",
              };
              if (tag.type === TagType.COLOR) {
                style.borderBottom = `5px solid ${tag.value}`;
              }
              return (
                <span key={tag._id} style={style}>
                  {tag.name}
                  {i < tags.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </p>
        );
      },
    },
    {
      field: "packageNo",
      headerName: t("packageNo"),
      flex: 1,
      width: 300,
    },
    {
      field: "inputPrice",
      headerName: t("input price"),
      flex: 1,
      width: 300,
    },
    {
      field: "count",
      headerName: t("count"),
      flex: 1,
      width: 300,
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
