// import React from "react";
// import useTranslation from "next-translate/useTranslation";
// import { CellParams } from "@material-ui/data-grid";

// import { ColorBox } from "components/Color";
// import { TagType } from "models";
// import { useListData } from "hooks/useListData";

// export const name = "warehouse";

// const TagList = () => {
//   const { t } = useTranslation("common");
//   const headers = [
//     {
//       field: "item",
//       headerName: t("name"),
//       flex: 1,
//       // width: 300,
//       valueGetter: (params: CellParams) => {
//         return `${params.row.item?.name}`;
//       },
//     },
//     {
//       field: "count",
//       headerName: t("count"),
//       flex: 1,
//       // width: 300,
//       // renderCell: (params: CellParams) => {
//       //   if (params.row.type === TagType.COLOR) {
//       //     return <ColorBox color={`${params.value}`} />;
//       //   }
//       //   return <span>{params.value}</span>;
//       // },
//     },
//     // {
//     //   field: "type",
//     //   headerName: t("type"),
//     //   flex: 1,
//     //   width: 300,
//     //   valueGetter: (param: CellParams) => {
//     //     return t(`${param.value}`);
//     //   },
//     // },
//   ];
//   const { Render } = useListData({
//     name,
//     tableHeaders: headers,
//     disableColumnSelector: true,
//   });
//   return Render;
// };
// export default TagList;
import React, { useEffect, useState } from "react";
import {
  CellParams,
  Columns,
  PageChangeParams,
  SortItem,
} from "@material-ui/data-grid";
import { toast } from "react-toastify";
import useTranslation from "next-translate/useTranslation";

import { useTable } from "hooks/useTable";
import { useHeader } from "hooks/useHeader";
import { Product, Tag, Location, TagType } from "models";
import { getList } from "services";

import { useStyles } from "./styles";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";

const name = "warehouse";
const Warehouse = () => {
  const classes = useStyles();
  const { t } = useTranslation("common");
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [listLocations, setListLocations] = useState<Location[]>([]);
  const [location, setLocation] = useState<Location | null>();
  const [sort, setSort] = useState<SortItem>();
  const limit = 10;
  const tableHeaders = [
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
      field: "count",
      headerName: t("count"),
      flex: 1,
      width: 300,
    },
  ];
  const getData = () => {
    getList(name, { location: location?._id, sort })
      .then((res) => {
        const newData: any[] = [];
        res.data?.forEach((item: any) => {
          item.id = item._id;
          let index = -1;
          for (let i = 0; i < newData.length; i++) {
            const e = newData[i];
            if (e.item?._id === item.item?._id) {
              index = i;
            }
          }
          if (index > -1) {
            newData[index].count += item.count || 0;
          } else {
            newData.push(item);
          }
        });
        setTotal(newData.length);
        setData(newData);
      })
      .catch((e) => {
        toast.error(t("can't load data"));
      });
  };
  const getListLocation = () => {
    getList("location").then((res) => {
      setListLocations(res?.data || []);
    });
  };
  const onPageChange = (params: PageChangeParams) => {
    const page = params.page;
    setPage(page);
  };
  const onSortChange = (sortItem: SortItem) => {
    setSort(sortItem);
  };

  useEffect(() => {
    getData();
  }, [page, limit, location, sort]);

  useEffect(() => {
    getListLocation();
  }, []);
  const { TableComponent } = useTable({
    data,
    headers: tableHeaders,
    total,
    onPageChange,
    onSortChange,
    pageSize: limit,
    disableColumnSelector: true,
    paginationMode: "client",
  });
  const { Header } = useHeader(name, {
    unableaAdd: true,
  });
  return (
    <div className={classes.container}>
      {Header}
      <Grid container className={classes.group} spacing={4}>
        <Grid item xs={12} sm={6}>
          <Autocomplete
            id="location"
            options={listLocations}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) => `${option.name}`}
            value={location}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("location")}
                variant="outlined"
                fullWidth={true}
              />
            )}
            onChange={(e: any, value: Location | null) => setLocation(value)}
          />
        </Grid>
      </Grid>
      {TableComponent}
    </div>
  );
};
export default Warehouse;
