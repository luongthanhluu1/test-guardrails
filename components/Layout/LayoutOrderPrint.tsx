import React from "react";
import { format } from "date-fns";
import { Table } from "antd";
import Barcode from "react-barcode";

import { formatMoney, removeUnicode } from "shared/utils";
import {
  lineClamp,
  infoUser,
  borderRight,
  rowInfo,
  print,
  h1,
  p,
} from "./layout.module.css";

const columns = [
  {
    title: "Sản phẩm",
    key: "0",
    render: (_, row) => {
      return (
        <div>
          <span>{row.name}</span>
        </div>
      );
    },
  },
  {
    title: "Số lượng",
    key: "1",
    render: (_, row) => (
      <div style={{ alignItems: "center" }}>
        <span>{row.quantity}</span>
      </div>
    ),
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "2",
    render: (_, row) => <span>{formatMoney(row.price)} vnđ</span>,
  },
  {
    title: "Có/Ko",
  },
  {
    title: "Ghi chú",
    dataIndex: "note",
    render: (_, row) => <span>{row.note}</span>,
  },
];

interface ItemInfoProps {
  title: string;
  value: string;
  phone?: string;
  column3: string;
  txtRight: string;
}

const ItemInfo = ({
  title,
  value,
  phone,
  column3,
  txtRight,
}: ItemInfoProps) => {
  return (
    <div style={{ display: "flex", flexDirection: "row" }} className={p}>
      {title ? (
        <div style={{ flex: 0.4 }} className={borderRight}>
          <span className={p} style={{ fontWeight: "900" }}>
            {title}
          </span>
        </div>
      ) : null}
      <div
        style={{
          flex: column3 ? 1 : 0.5,
          textAlign: txtRight ? "right" : "left",
        }}
        className={!column3 ? borderRight : ""}
      >
        <span className={p}>{value || ""}</span>
      </div>
      {!column3 ? (
        <div style={{ flex: 0.3 }}>
          <span className={p}>{phone || ""}</span>
        </div>
      ) : null}
    </div>
  );
};

const ItemInfoUser = ({ title, phone }) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        flex: 1,
        justifyContent: "space-between",
      }}
      className={p}
    >
      <div className={borderRight}>
        <span className={p} style={{ fontWeight: "900" }}>
          {title}
        </span>
      </div>
      <div>
        <span className={p}>{phone || ""}</span>
      </div>
    </div>
  );
};

export class LayoutPrint extends React.Component<{ data: any }> {
  renderItem = (data, index) => {
    let items = [];
    let total = 0;
    const cartValues = Object.values(data.cart);
    try {
      for (let index = 0; index < cartValues.length; index++) {
        const item = cartValues[index];
        items.push({
          id: item.product.id,
          name: item.product.name,
          quantity: item.qty,
          price: item.unitPrice,
          unit: item.product.unit,
          ...item,
          product: { ...item.product },
        });
        total = total + (item.qty + (item.adjustment ?? 0)) * item.unitPrice;
      }
    } catch (e) {}

    const { ship_fee, discount_value } = data;

    let voucher = data.voucher ? data.voucher.value : 0;

    const discountValue = discount_value ? discount_value : voucher;

    let totalCart = total + ship_fee - discountValue;
    totalCart = totalCart > 0 ? totalCart : 0;

    return (
      <div className={print} key={index}>
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 8,
          }}
        >
          <img
            src="/logoMio_black.png"
            alt="ava logo"
            style={{ height: 46, borderRadius: 8, marginRight: 8 }}
          />
        </div>
        <div className={p} style={{ marginBottom: 8 }}>
          <span className={p}>Website: https://www.mioapp.co</span>
          <br />
          <span className={p}>
            Trung tâm hỗ trợ: Ehome 3 - A7 - 007 - Hồ Ngọc Lãm, P. An Lạc, Q.
            Bình Tân, Tp. HCM
          </span>
        </div>
        <div>
          <div className={infoUser}>
            <div
              style={{
                height: 1,
                margin: 4,
                marginLeft: 0,
                backgroundColor: "#c3c3c3",
              }}
            />
            <ItemInfoUser
              title={"CTV: " + data.partner_name}
              phone={data.partner_phone}
            />
            <ItemInfo title="" value={data.partner_address} column3 />
            <div style={{ height: 2 }} />
          </div>
          <div className={infoUser}>
            <ItemInfoUser
              title={"KH: " + (data.shipment ? data.shipment.name : "")}
              phone={data.shipment ? data.shipment.phone : ""}
            />
            <ItemInfo
              title=""
              value={data.shipment ? data.shipment.address : ""}
              column3
            />
          </div>
        </div>
        <ItemInfo
          title="Ngày đặt"
          value={format(new Date(data.created_at), "dd/MM/yyyy")}
          column3
          txtRight
        />
        <ItemInfo
          title="KH ghi chú"
          value={data.note ? data.note : "(Không có)"}
          column3
        />
        <div
          style={{
            height: 1,
            margin: 4,
            marginLeft: 0,
            backgroundColor: "#c3c3c3",
            marginTop: 8,
          }}
        />
        {/* <Table dataSource={items} columns={columns} pagination={false} /> */}
        <div
          style={{
            display: "flex",
            flex: 1,
            flexDirection: "row",
            margin: 4,
            marginTop: 12,
            marginBottom: 8,
          }}
          className={p}
        >
          <span style={{ flex: 1, fontWeight: "900" }} className={p}>
            {"Sản phẩm"}
          </span>
          <span
            className={p}
            style={{ flex: 0.5, textAlign: "right", fontWeight: "900" }}
          >
            {"SL"}
          </span>
          <span
            className={p}
            style={{ flex: 0.8, textAlign: "right", fontWeight: "900" }}
          >
            {"Thành tiền"}
          </span>
          <span
            className={p}
            style={{
              flex: 0.2,
              fontSize: 16,
              textAlign: "right",
              lineHeight: "6px",
            }}
          >
            {" "}
          </span>
        </div>
        <div>
          {items.map((item) => {
            return (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "row",
                  margin: 6,
                  marginBottom: 10,
                }}
                className={p}
              >
                <span style={{ flex: 1 }} className={p}>
                  {item.name}
                </span>
                <span className={p} style={{ flex: 0.5, textAlign: "right" }}>
                  {`${item.qty + (item.adjustment ?? 0)} x ${
                    item.product.unit ?? ""
                  }`}
                </span>
                <span className={p} style={{ flex: 0.8, textAlign: "right" }}>
                  {formatMoney(
                    (item.qty + (item.adjustment ?? 0)) * item.price
                  )}{" "}
                  đ
                </span>
                <span
                  className={p}
                  style={{
                    flex: 0.2,
                    fontSize: 18,
                    textAlign: "right",
                    lineHeight: "8px",
                  }}
                >
                  {"☐"}
                </span>
              </div>
            );
          })}
        </div>
        <div
          style={{
            height: 1,
            margin: 4,
            marginLeft: 0,
            marginTop: 8,
            backgroundColor: "#c3c3c3",
          }}
        />
        <div className={infoUser} style={{ marginTop: 8 }}>
          <ItemInfo
            title="Tổng tiền"
            value={`${formatMoney(total)} đ`}
            column3={true}
            txtRight
          />
          <ItemInfo
            title="Phí ship"
            value={`${formatMoney(ship_fee)} đ`}
            column3
            txtRight
          />
          <ItemInfo
            title="Giảm giá"
            value={`${formatMoney(discountValue)} đ`}
            column3
            txtRight
          />
          <ItemInfo
            value={`${formatMoney(totalCart)} đ`}
            title="Thanh toán"
            column3
            txtRight
          />
        </div>
        <div
          style={{
            height: 1,
            backgroundColor: "#c3c3c3",
            marginTop: 10,
            marginBottom: 10,
          }}
        />
        <div style={{ textAlign: "center" }} className={p}>
          <span className={p}>{"Tươi ngon giá rẻ"}</span>
          <br />
          <span className={p}>{"Ngay trước cửa nhà"}</span>
        </div>
        <div
          style={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div>
            <Barcode
              width={1}
              height={50}
              value={removeUnicode(data.id)}
              displayValue
              fontSize={14}
            />
          </div>
        </div>
      </div>
    );
  };

  render() {
    const { data } = this.props;

    return <div>{data.map((item, index) => this.renderItem(item, index))}</div>;
  }
}
