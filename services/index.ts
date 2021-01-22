import { SortItem } from "@material-ui/data-grid";
import axios from "axios";
import { Product, Status, Tag } from "models";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}v1/`;

export interface Filter {
  name: string;
  value: string;
}
interface ParamsList {
  page?: number;
  limit?: number;
  fromDate?: string;
  toDate?: string;
  location?: string;
  sort?: SortItem;
  sortBy?: string;
  sortDirection?: string | null;
  status?: Status;
  filter?: Filter;
}

export const create = (name: string, data: Product | Tag) => {
  return axios.post(`${apiUrl}${name}s`, data);
};

export const update = (name: string, data: Product | Tag) => {
  return axios.put(`${apiUrl}${name}s/` + data._id, data);
};

export const getList = async (
  name: string,
  {
    page,
    limit,
    location,
    sort,
    status,
    fromDate,
    toDate,
    filter,
  }: ParamsList = {}
) => {
  const params: any = {
    page: page,
    limit: limit,
  };
  if (location) {
    params.location = location;
  }
  if (sort) {
    params.sortBy = sort.field;
    params.sortDirection = sort.sort;
  }
  if (status) {
    params.status = status;
  }
  if (filter && filter.name) {
    params[filter.name] = filter.value;
  }
  if (fromDate) params.fromDate = fromDate;
  if (toDate) params.toDate = toDate;
  return axios
    .get(`${apiUrl}${name}s`, {
      params,
    })
    .then((res) => res?.data);
};

export const getById = async (name: string, id: string) => {
  return axios.get(`${apiUrl}${name}s/` + id).then((res) => res?.data);
};

export const deleteAll = async (name: string, ids: (string | number)[]) => {
  return axios
    .post(`${apiUrl}${name}s/deleteByListIds`, { ids })
    .then((res) => res?.data);
};
