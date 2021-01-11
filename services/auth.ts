import { SortItem } from "@material-ui/data-grid";
import axios from "axios";
import { Product, Status, Tag } from "models";

const apiUrl = "http://134.209.97.209:3001/v1/";

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
}

export const create = (name: string, data: Product | Tag) => {
  return axios.post(`${apiUrl}${name}s`, data);
};

export const login = (username: string, password: string) => {
  return axios.post(`${apiUrl}users/login`, {
    username,
    password,
  });
};
