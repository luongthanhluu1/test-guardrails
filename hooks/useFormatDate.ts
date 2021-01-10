import moment from "moment";
export const useFormatDate = (date: string | Date) => {
  return moment(date).format("MM/DD/YYYY");
};
