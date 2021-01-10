import { Cart } from "./Cart";
import { Contact } from "./Contact";
import { Location } from "./Location";
import { Partner } from "./Partner";
import { Product } from "./Product";
import { Tag } from "./Tag";

export interface Shipment {
  name: string;
  address: string;
  phone: string;
}

export enum Type {
  Input = "input",
  Output = "output",
  Produce = "produce",
  Move = "move",
}

export enum Status {
  Waiting = "waiting",
  Approved = "approved",
  Unpaid = "unpaid",
  Completed = "completed",
  Canceled = "canceled",
  Deleted = "deleted",
}

export interface OrderItem {
  _id?: string;
  id?: string;
  tags?: Tag[];
  quantily: number;
  price?: string | number;
  inputPrice?: string | number;
  totalPrice?: string | number;
  name?: string;
}

export interface Order {
  id?: string;
  _id?: string;
  type: Type;
  costs?: number;
  curency?: string;
  customer?: Contact;
  createdAt?: string;
  deliver?: Contact;
  date?: string;
  items?: OrderItem[];
  requireItems?: OrderItem[];
  note?: string;
  locationFrom?: Location;
  locationTo?: Location;
  inputDate?: string;
  isWarehouse?: boolean;
  promoteCode?: string;
  promo?: number;
  price?: number;
  profit?: number;
  totalPrice?: number;
  outputDate?: string;
  status?: Status;
  waste?: number;
}

export const TypeOptions = [Type.Input, Type.Output, Type.Produce, Type.Move];
export const StatusOptions = [
  Status.Waiting,
  Status.Approved,
  Status.Unpaid,
  Status.Completed,
  Status.Canceled,
];
