import React from "react";
import useTranslation from "next-translate/useTranslation";
import { CellParams } from "@material-ui/data-grid";

import { ColorBox } from "components/Color";
import { Role, TagType } from "models";
import { useListData } from "hooks/useListData";
import { useSelector } from "react-redux";
import { RootState } from "stores";
import { useRouter } from "next/router";

export const name = "user";

const TagList = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  if (user?.role === Role.MEMBER) {
    router.push("/order");
  }
  if (!user || !user.role || user.role !== Role.ADMIN) {
    return null;
  }
  const { t } = useTranslation("common");
  const headers = [
    { field: "username", headerName: t("username"), flex: 1, width: 300 },
    {
      field: "role",
      headerName: t("role"),
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
