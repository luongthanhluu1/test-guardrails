import { Tag } from "./Tag";

interface PriceItem {
  label: string;
  qty: number;
  price: number;
}

interface PriceList {
  [name: string]: PriceItem;
}

interface ProductInfo {
  banner: string;
  description: string;
  tags: string;
  photos: string[];
}
export interface Product {
  id?: string;
  _id?: string;
  name?: string;
  photo?: string;
  category?: string;
  origin?: string;
  inputPrice: number | string;
  price?: number | string;
  unit?: string;
  info?: ProductInfo;
  tags?: Tag[];
}

export interface ProfitProduct {}

export interface HotProduct {}

export interface InventoryItem {
  id: string;
  name?: string;
  photo?: string;
  category?: string;
  origin?: string;
  market_price?: number;
  price: number;
  price_list?: PriceList;
  out_of_stock?: boolean;
  sold_out?: boolean;
  is_deleted?: boolean;
  unit?: string;
  info?: ProductInfo;
  qty: number;
  adjustment?: number;
}

export interface Inventories {
  [id: string]: InventoryItem;
}
