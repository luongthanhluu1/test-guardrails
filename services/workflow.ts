import axios from "axios";
import { Tag } from "models";

const apiUrl = "http://134.209.97.209:3001/v1/workflows";

export const create = (data: Tag) => {
  return axios.post(apiUrl, data);
};

export const getByItemId = async (itemId: string) => {
  return axios.get(apiUrl + `/getByItemId/${itemId}`).then((res) => res?.data);
};
