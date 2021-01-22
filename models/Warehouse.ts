import { Product } from "./Product";
import { Location } from "./Location";

export interface Warehouse {
  _id?: string;
  id?: string;
  item: Product;
  location: Location;
  packageNo?: string;
  inputPrice?: number;
  count?: number;
}
