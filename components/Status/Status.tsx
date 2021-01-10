import React from "react";

import useTranslation from "next-translate/useTranslation";
import { colors } from "@material-ui/core";

interface ColorProps {
  status: ItemStatus;
}
import { Status as ItemStatus } from "models/Order";
const statusColors = {
  [ItemStatus.Approved]: colors.blue.A700,
  [ItemStatus.Canceled]: colors.red.A700,
  [ItemStatus.Completed]: colors.green.A700,
  [ItemStatus.Deleted]: colors.common.black,
  [ItemStatus.Unpaid]: colors.red.A700,
  [ItemStatus.Waiting]: colors.common.black,
};
export const StatusText = ({ status }: ColorProps) => {
  const { t } = useTranslation("common");
  return (
    <span style={{ color: statusColors[status] }}>{t("status " + status)}</span>
  );
};
