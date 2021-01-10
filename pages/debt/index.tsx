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
import {
  Contact,
  Tag,
  Location,
  TagType,
  Order,
  Status,
  Type,
  Role,
} from "models";
import { getList } from "services";

import { useStyles } from "./styles";
import { Grid, TextField } from "@material-ui/core";
import { Autocomplete } from "@material-ui/lab";
import { DisplayPrice } from "components/DisplayPrice";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { RootState } from "stores";

const name = "debt";
interface ListContacts {
  [id: string]: Contact;
}

interface ListLocations {
  [id: string]: Location;
}

interface ListData {
  id: string;
  name: string;
  address: string;
  phone: string;
  total: number;
  type: string;
}

const Warehouse = () => {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user);
  if (user?.role === Role.MEMBER) {
    router.push("/order");
  }
  const classes = useStyles();
  const { t } = useTranslation("common");
  const [orders, setOrders] = useState<Order[]>([]);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [listContacts, setListContacts] = useState<ListContacts>();
  const [listLocations, setListLocations] = useState<ListLocations>();
  const [contact, setContact] = useState<Location | null>();
  const [sort, setSort] = useState<SortItem>();
  const limit = 10;
  const tableHeaders = [
    {
      field: "type",
      headerName: t("type"),
      flex: 1,
      width: 300,
      valueGetter: (params: CellParams) => {
        return t(`${params.value}`);
      },
      filterable: false,
    },
    {
      field: "name",
      headerName: t("name"),
      flex: 1,
      width: 300,
    },
    {
      field: "address",
      headerName: t("address"),
      flex: 1,
      width: 300,
    },
    {
      field: "phone",
      headerName: t("phone"),
      flex: 1,
      width: 300,
    },
    {
      field: "total",
      headerName: t("total"),
      flex: 1,
      width: 300,
      renderCell: (params: CellParams) => {
        return (
          <span className={(params.value || 0) < 0 ? classes.colorRed : ""}>
            <DisplayPrice value={`${params.value || 0}`} />
          </span>
        );
      },
    },
  ];
  const getOrders = () => {
    getList("order", { sort, status: Status.Unpaid })
      .then((res) => {
        setOrders(res?.data || []);
      })
      .catch((e) => {
        toast.error(t("can't load data"));
      });
  };
  const getListContact = () => {
    getList("contact").then((res) => {
      if (res?.data) {
        const newList: ListContacts = {};
        res?.data?.forEach((contact: Contact) => {
          newList[contact?._id || ""] = contact;
        });
        setListContacts(newList);
      }
    });
  };

  const getListLocation = () => {
    getList("location").then((res) => {
      if (res?.data) {
        const newList: ListLocations = {};
        res?.data?.forEach((location: Location) => {
          newList[location?._id || ""] = location;
        });
        setListLocations(newList);
      }
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
    if (orders?.length && listContacts && listLocations) {
      const newData: { [id: string]: ListData } = {};
      orders?.forEach((order) => {
        if (order.type === Type.Output) {
          const customer = listContacts[`${order?.customer}`];
          const id = `${order.type}-${order.customer?._id}`;
          if (!newData[id]) {
            newData[id] = {
              id,
              name: `${customer?.name}`,
              address: `${customer?.address}`,
              phone: `${customer?.phone}`,
              type: "customer",
              total: -(order.totalPrice || 0),
            };
          } else {
            newData[id].total -= order.totalPrice || 0;
          }
        }
        if (order.type === Type.Produce || order.type === Type.Input) {
          const location = listLocations[`${order.locationFrom}`];
          const id = `${order.type}-${order._id}`;
          if (!newData[id]) {
            newData[id] = {
              id,
              name: `${location?.name}`,
              address: `${location?.address}`,
              phone: "",
              type: "location",
              total: order.totalPrice || 0,
            };
          } else {
            newData[id].total += order.totalPrice || 0;
          }
        }
      });
      //map object to array data
      const arrayData: ListData[] = [];
      for (const [key, value] of Object.entries(newData)) {
        arrayData.push(value);
      }
      setData(arrayData);
      setTotal(arrayData.length);
    }
  }, [orders, listContacts, listLocations]);

  useEffect(() => {
    getOrders();
  }, [page, limit, location, sort]);

  useEffect(() => {
    getListContact();
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
    showToolbar: true,
    paginationMode: "client",
    sortingMode: "client",
  });
  const { Header } = useHeader(name, {
    unableaAdd: true,
  });
  if (!user || !user.role || user.role !== Role.ADMIN) {
    return null;
  }
  return (
    <div className={classes.container}>
      {Header}
      <Grid container className={classes.group} spacing={4}>
        {/* <Grid item xs={12} sm={6}>
          <Autocomplete
            id="contact"
            options={listContacts}
            autoHighlight
            fullWidth={true}
            getOptionLabel={(option) => `${option.name}`}
            value={contact}
            renderInput={(params) => (
              <TextField
                {...params}
                label={t("location")}
                variant="outlined"
                fullWidth={true}
              />
            )}
            onChange={(e: any, value: Location | null) => setContact(value)}
          />
        </Grid> */}
      </Grid>
      {TableComponent}
    </div>
  );
};
export default Warehouse;
