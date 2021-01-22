import React, { useEffect, useState } from "react";
import { Columns, PageChangeParams, SortItem } from "@material-ui/data-grid";
import { toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";

import { useTable } from "hooks/useTable";
import { useHeader } from "hooks/useHeader";
import { Product, Tag } from "models";
import { Filter, getList } from "services";

import { useStyles } from "./styles";

interface UseListDataProps {
  name: string;
  tableHeaders: Columns;
  viewable?: boolean;
  unableDelete?: boolean;
  disableColumnSelector?: boolean;
  showToolbar?: boolean;
  title?: string;
  filter?: Filter;
}

export const useListData = ({
  name,
  tableHeaders,
  viewable = false,
  unableDelete = false,
  disableColumnSelector,
  showToolbar = false,
  title,
  filter,
}: UseListDataProps) => {
  const classes = useStyles();
  const { t } = useTranslation("common");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortItem>();
  const limit = 10;

  const onSortChange = (sortItem: SortItem) => {
    setSort(sortItem);
  };

  const getData = () => {
    getList(name, { page, limit, sort, filter })
      .then((res) => {
        setTotal(res.total);
        setData(
          res.data?.map((item: Product | Tag) => {
            item.id = item._id;
            return item;
          }) || []
        );
      })
      .catch((e) => {
        toast.error(t("can't load data"));
      });
  };
  const onAfterDeleted = (count: number) => {
    toast.success(`${t("deleted", { count })} ${t(name)}`);
    getData();
  };
  const onPageChange = (params: PageChangeParams) => {
    const page = params.page;
    setPage(page);
  };
  useEffect(() => {
    getData();
  }, [page, limit, sort]);
  const { TableComponent, selected } = useTable({
    data,
    headers: tableHeaders,
    total,
    onSortChange,
    onPageChange,
    pageSize: limit,
    disableColumnSelector,
    showToolbar,
  });
  const { Header } = useHeader(name, {
    selected,
    onAfterDeleted,
    viewable,
    unableDelete,
    title,
  });
  const Render = (
    <div className={classes.container}>
      {Header}
      {TableComponent}
    </div>
  );
  return { Render };
};
