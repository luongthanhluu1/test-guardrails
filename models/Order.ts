import { Cart } from "./Cart";
import { Partner } from "./Partner";
import { Voucher } from "./Voucher";

export interface Shipment {
  name: string;
  address: string;
  phone: string;
}

export interface Order {
  cart?: Cart;
  created_at?: string;
  customer_id?: string;
  customer_name?: string;
  customer_photo?: string;
  discount_value?: number;
  id?: string;
  is_demo_account?: boolean;
  note?: string;
  order_created_at?: string;
  partners?: Partner[];
  partner_address?: string;
  partner_id?: string;
  partner_name?: string;
  partner_phone?: string;
  partner_photo?: string;
  ship_fee?: number;
  shipment?: Shipment;
  status?: string;
  updated_at?: string;
  voucher?: Voucher;
}

export const StatusOrderList = [
  "",
  "Đã Tiếp Nhận",
  "Lưu Kho Ava",
  "Chờ Giao Đối Tác",
  "Đang Giao Đối Tác",
  "Đã Giao Đối Tác",
  "Đã Thu Tiền Đối Tác",
  "Lưu Kho Đối Tác",
  "Đã Giao Khách",
  "Hoàn Tất",
  "Trả Hàng",
  "Có Sự Cố",
];
export interface StatusMapColorInterface {
  waiting: string;
  processing: string;
  completed: string;
  canceled: string;
}
export const StatusMapColor: StatusMapColorInterface = {
  waiting: "purple",
  processing: "blue",
  completed: "green",
  canceled: "red",
};

export enum StatusSkuColor {
  "Đã Tiếp Nhận" = "purple",
  "Lưu Kho Ava" = "blue",
  "Chờ Giao Đối Tác" = "blue",
  "Đang Giao Đối Tác" = "blue",
  "Đã Giao Đối Tác" = "green",
  "Đã Thu Tiền Đối Tác" = "black",
  "Lưu Kho Đối Tác" = "black",
  "Đã Giao Khách" = "black",
  "Hoàn Tất" = "green",
  "Trả Hàng" = "red",
  "Có Sự Cố" = "red",
}

export enum Status {
  EMPTY = "",
  RECEIVED = "Đã Tiếp Nhận",
  SAVED_OUR_STORAGE = "Lưu Kho Ava",
  WAITING_SHIP_PARTNER = "Chờ Giao Đối Tác",
  SHIPPING_PARTNER = "Đang Giao Đối Tác",
  GAVE_PARTNER = "Đã Giao Đối Tác",
  RECEIVED_MONEY_PARTNER = "Đã Thu Tiền Đối Tác",
  SAVED_PARTNER_STORAGE = "Lưu Kho Đối Tác",
  GAVE_CUSTOMER = "Đã Giao Khách",
  COMPLETED = "Hoàn Tất",
  RETURN = "Trả Hàng",
  PRODLEM = "Có Sự Cố",
}
