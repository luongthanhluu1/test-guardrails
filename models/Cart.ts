import { Status } from "./Order";
import { Product } from "./Product";

export interface CartItem {
  created_at: number;
  id: string;
  product: Product;
  product_id: string;
  profit: number;
  qty: number;
  status: Status;
  unitPrice: number;
  adjustment: number;
}

export interface Cart {
  [id: string]: CartItem;
}
