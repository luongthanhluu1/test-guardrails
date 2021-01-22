import axios from "axios";
import { Tag } from "models";

const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}v1/workflows`;

export const create = (data: Tag) => {
  return axios.post(apiUrl, data);
};

export const getByItemIdAndLocationId = async (
  itemId: string,
  locationId: string
) => {
  return axios
    .post(apiUrl + `/getByItemIdAndLocationId`, {
      itemId,
      locationId,
    })
    .then((res) => res?.data);
};
