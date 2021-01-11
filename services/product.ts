import axios from "axios";
import { Product } from "models";

const apiUrl = "http://134.209.97.209:3001/v1/items";
interface ParamsList {
  page?: number;
  limit?: number;
}
export const create = (data: Product) => {
  return axios.post(apiUrl, data);
};

export const update = (data: Product) => {
  return axios.put(apiUrl + "/" + data.id, data);
};

export const getList = async ({ page, limit }: ParamsList = {}) => {
  return axios
    .get(apiUrl, {
      params: {
        page: page,
        limit: limit,
      },
    })
    .then((res) => res?.data);
};

export const getById = async (id: string) => {
  return axios.get(apiUrl + "/" + id).then((res) => res?.data);
};

export const deleteAll = async (ids: (string | number)[]) => {
  return axios
    .post(apiUrl + "/deleteByListIds", { ids })
    .then((res) => res?.data);
};
