import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";

import { Tag, TagType } from "models";
import { useListData } from "hooks/useListData";
import { DisplayPrice } from "components/DisplayPrice";

export const name = "item";

const ProductList = () => {
  const { t } = useTranslation("common");
  const headers = [
    { field: "name", headerName: t("name"), flex: 1, width: 300 },
    {
      field: "tags",
      headerName: t("tag"),
      flex: 1,
      resizable: false,
      width: 300,
      renderCell: (params: CellParams) => {
        const tags: Tag[] = params.row.tags || [];
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
      field: "inputPrice",
      headerName: t("input price"),
      flex: 1,
      width: 300,
      renderCell: (params: CellParams) => {
        return <DisplayPrice value={`${params.value || 0}`} />;
      },
    },
    {
      field: "price",
      headerName: t("sell price"),
      flex: 1,
      width: 300,
      renderCell: (params: CellParams) => {
        return <DisplayPrice value={`${params.value || ""}`} />;
      },
    },
  ];
  const { Render } = useListData({ name, tableHeaders: headers });
  return Render;
};
export default ProductList;
