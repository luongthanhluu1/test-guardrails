import NumberFormat from "react-number-format";
interface DisplayPriceProps {
  value: number | string;
}
export const DisplayPrice = ({ value }: DisplayPriceProps) => {
  return (
    <NumberFormat
      value={value}
      displayType={"text"}
      thousandSeparator={true}
      prefix={"$"}
    />
  );
};
