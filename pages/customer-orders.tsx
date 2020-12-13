import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";

import {
  Table,
  Button,
  Card,
  Checkbox,
  DatePicker,
  Row,
  Col,
  Radio,
  Tag,
  Modal,
  Alert,
  Input,
  Select,
  notification,
} from "antd";
const { TextArea } = Input;
import { useEffect, useState, useMemo, useRef } from "react";
import { useToggle } from "react-use";
import fileDownload from "js-file-download";
import moment from "moment";
import ReactToPrint from "react-to-print";
import { FaUserCircle } from "react-icons/fa";

import {
  getCustomerOrders,
  getPartners,
  updateOrderStatus,
  updateCustomerOrderNote,
} from "shared/api";
import {
  formatMoney,
  compare,
  getCartProfit,
  getCartTotal,
} from "shared/utils";
import { LayoutPrint } from "components/Layout";
import { createStore } from "shared/local-store";
import { actions } from "stores/customer-orders";
import { actions as actionPartners } from "stores/partners";
import {
  StatusOrderList,
  StatusMapColor,
  StatusMapColorInterface,
  StatusSkuColor,
  Order,
  Status,
} from "models/Order";
import { Partner } from "models/Partner";
import { RootState } from "stores";
import { Cart, CartItem } from "models/Cart";
import { Inventories, Product } from "models/Product";

interface RowActionProps {
  data: any;
  text: keyof StatusMapColorInterface | undefined;
}

interface OrderModalProps {
  note?: string;
  setNote?: (a?: string) => void;
}

interface InventoryItemsProps {
  orders: Order[];
}

interface ColumnItem {
  title: string;
  key: string;
  dataIndex?: string;
  render: (
    text: string,
    record: Order,
    index: number,
    status?: keyof StatusMapColorInterface
  ) => number | string | React.ReactElement;
}
const CheckboxGroup = Checkbox.Group;
const { RangePicker } = DatePicker;

const dateFormat = "YYYY/MM/DD";

const columns: ColumnItem[] = [
  {
    title: "No",
    key: "index",
    render: (text, record, index) => index + 1,
  },
  {
    title: "Đối tác",
    key: "partner_name",
    render: (_, { partner_name, partner_photo, partner_address }: Order) => (
      <div style={{ display: "block" }}>
        {partner_photo ? (
          <img
            src={partner_photo}
            alt={partner_name}
            style={{
              borderRadius: 999,
              width: 32,
              height: 32,
              objectFit: "cover",
            }}
          />
        ) : (
          <FaUserCircle size="32px" />
        )}

        <p style={{ marginLeft: 4 }}>{partner_name}</p>
        <p style={{ marginLeft: 4, fontWeight: 600, height: 88, width: 100 }}>
          {partner_address}
        </p>
      </div>
    ),
  },
  {
    title: "Khách hàng",
    key: "3",
    render: (_, { shipment, customer_name, customer_photo }) => (
      <div style={{ display: "block" }}>
        {customer_photo ? (
          <img
            src={customer_photo}
            alt={customer_name}
            style={{
              borderRadius: 999,
              width: 32,
              height: 32,
              objectFit: "cover",
            }}
          />
        ) : (
          <FaUserCircle size="32px" />
        )}
        <p style={{ marginLeft: 4 }}>{shipment?.name ?? customer_name}</p>
        <p style={{ marginLeft: 4, fontWeight: 600, height: 88, width: 100 }}>
          {shipment?.address ?? ""}
        </p>
      </div>
    ),
  },
  {
    title: "Mã đơn",
    dataIndex: "id",
    key: "4",
    render: (text, row) => {
      let dispatch = useDispatch();
      // let setNote = useLocalStore((store) => store.setNote);

      let onSelect = () => {
        dispatch(actions.selectOrder(row));
        // setNote(row.note);
      };
      return (
        <div>
          <Button style={{ padding: 0 }} type="link" onClick={onSelect}>
            {text}
          </Button>
          {row.note ? <p>{`note: ${row.note}`}</p> : null}
        </div>
      );
    },
  },
  {
    title: "Sản phẩm",
    key: "product",
    render: (_, { cart }) => (
      <span
        style={{
          fontSize: 12,
          fontWeight: 600,
          height: 55,
          display: "block",
          width: 200,
        }}
      >
        {cart
          ? Object.values(cart)
              .map((item) => item.product.name)
              .join(", ")
          : ""}
      </span>
    ),
  },
  {
    title: "Trạng thái SKUs",
    key: "product",
    render: (_, { cart }) => {
      return (
        <Tag
          // color={StatusSkuColor[finalStatus(Object.values(cart))] || "black"}
          style={{ textTransform: "capitalize" }}
        >
          {finalStatus(cart ? Object.values(cart) : [])}
        </Tag>
      );
    },
  },
  // {
  //   title: 'Số lượng',
  //   key: '6',
  //   render: (_, { cart }) =>
  //     Object.values(cart).reduce(
  //       (sum, item) => sum + (item.qty + (item.adjustment ?? 0)),
  //       0
  //     )
  // },
  {
    title: "Tổng đơn",
    key: "110",
    render: (_, { cart }) => (
      <div style={{ textAlign: "right" }}>
        {formatMoney(
          cart
            ? Object.values(cart).reduce(
                (sum, item) =>
                  sum +
                  (item.qty + (item.adjustment ?? 0)) * item.product.price,
                0
              )
            : 0
        )}
      </div>
    ),
  },
  {
    title: "Gỉảm giá",
    key: "111",
    render: (_, { discount_value = 0, voucher }) => (
      <div style={{ textAlign: "right" }}>
        {discount_value
          ? formatMoney(discount_value)
          : voucher
          ? formatMoney(voucher.value)
          : 0}
      </div>
    ),
  },
  {
    title: "Phí ship",
    key: "112",
    render: (_, { ship_fee = 0 }) => (
      <div style={{ textAlign: "right" }}>{formatMoney(ship_fee)}</div>
    ),
  },
  {
    title: "Thành tiền",
    key: "11",
    render: (_, { cart, ship_fee = 0, discount_value = 0, voucher }) => {
      const discount = discount_value
        ? discount_value
        : voucher
        ? voucher.value
        : 0;
      const total = cart
        ? Object.values(cart).reduce(
            (sum, item) =>
              sum + (item.qty + (item.adjustment ?? 0)) * item.product.price,
            0
          )
        : 0;
      return (
        <div style={{ textAlign: "right" }}>
          {formatMoney(total - discount + ship_fee)}
        </div>
      );
    },
  },
  // {
  //   title: 'Voucher',
  //   key: '8',
  //   render: (_, row) => {
  //     return (
  //       <div style={{ textAlign: 'right' }}>
  //         {row.voucher ? formatMoney(row.voucher.value) : 0}
  //       </div>
  //     );
  //   }
  // },
  {
    title: "$ đã trừ chiết khấu",
    key: "1110",
    render: (_, { partner_id, cart, partners, voucher }) => {
      const voucherValue = voucher ? voucher.value : 0;
      const partner = partners?.filter(
        (partner) => partner.id === partner_id
      )[0];
      const profitRatio = partner ? partner.profit_ratio : 0;

      const total = getCartTotal(cart);
      const profit = getCartProfit(cart, profitRatio);
      const paid = total - profit - voucherValue;

      return <div style={{ textAlign: "right" }}>{formatMoney(paid)}</div>;
    },
  },
  {
    title: "Ngày đặt",
    dataIndex: "created_at",
    key: "9",
    render: (text) => format(new Date(text), "dd/MM/yyyy HH:mm"),
  },
  {
    title: "Ngày cập nhật",
    dataIndex: "updated_at",
    key: "9",
    render: (text) => (text ? format(new Date(text), "dd/MM/yyyy") : ""),
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "10",
    // render: (text, row) => (
    //   <Tag color={StatusMapColor[text]} style={{ textTransform: 'capitalize' }}>
    //     {text}
    //   </Tag>
    // ),
    render: (text, row, _, status) => <RowActions data={row} text={status} />,
  },
];

const finalStatus = (cartItems: CartItem[]) => {
  let status: Status = cartItems[0]?.status || Status.COMPLETED;

  if (new Date(cartItems[0]?.created_at) < new Date(2020, 8, 18)) {
    return Status.COMPLETED;
  }

  for (let index = 0; index < cartItems.length; index++) {
    const item = cartItems[index];
    if (item.status !== status) {
      status = Status.RECEIVED;
      break;
    }
  }
  return status;
};

const RowActions: React.FC<RowActionProps> = ({ data, text = "waiting" }) => {
  const itemOrderRef = useRef<LayoutPrint>(null);
  const partnerArr = data.partners.filter((_partner: Partner) => {
    return _partner.id === data.partner_id;
  });
  const partner = partnerArr[0] || {};

  let dataOder = [];
  dataOder.push({ ...data, partner_address: partner.address });

  return (
    <div style={{ display: "flex" }}>
      <Tag color={StatusMapColor[text]} style={{ textTransform: "capitalize" }}>
        {text}
      </Tag>
      <ReactToPrint
        trigger={() => {
          return (
            <Tag color={"#aaa"} style={{ textTransform: "capitalize" }}>
              Print
            </Tag>
          );
        }}
        content={() => itemOrderRef.current}
      />
      <div style={{ display: "none" }}>
        <LayoutPrint ref={itemOrderRef} data={dataOder} />
      </div>
    </div>
  );
};
const OrderModal: React.FC<OrderModalProps> = ({ note, setNote }) => {
  let dispatch = useDispatch();
  let order = useSelector((store: RootState) => store.customerOrders.order);
  if (!order) return null;

  let toggleModal = () => dispatch(actions.selectOrder(null));
  let cartItems: CartItem[] = order?.cart ? Object.values(order?.cart) : [];
  let total = cartItems.reduce(
    (sum: number, item) =>
      sum + (item?.qty + (item?.adjustment ?? 0)) * item?.unitPrice,
    0
  );

  let cart = order?.cart;

  let status = "Đã Tiếp Nhận";

  const onChangeStatus = async (status: string, item: CartItem) => {
    const productID = item.product.id;
    cart = await updateOrderStatus({
      orderId: order?.id,
      cart,
      status,
      productId: productID,
    });

    cartItems = Object.values(cart ? cart : {});

    let orders = await getCustomerOrders();
    dispatch(actions.setOrders(orders));

    const updatedOrder = { ...order, cart };
    dispatch(actions.selectOrder(updatedOrder));
    notification.success({ message: "Cập nhật thành công", duration: 1 });
  };

  const onChangeAllStatus = async (status: string) => {
    for (let index = 0; index < cartItems.length; index++) {
      const item = cartItems[index];
      await onChangeStatus(status, item);
    }
  };

  const partnerArr = order.partners?.filter((_partner) => {
    return _partner.id === order?.partner_id;
  });
  const partner = partnerArr && partnerArr[0] ? partnerArr[0] : ({} as Partner);

  return (
    <Modal
      visible={true}
      title="Xem đơn hàng"
      onCancel={toggleModal}
      width={640}
      footer={null}
    >
      <div className="v-stack-md">
        <div className="v-stack-sm">
          <div>
            <span>Mã đơn: </span>
            <span>{order.id}</span>
          </div>
          <Select
            style={{ width: "100%" }}
            defaultValue={finalStatus(cartItems)}
            onChange={(e) => onChangeAllStatus(e)}
          >
            {StatusOrderList.map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <div>
            <span>{`Ngày đặt: ${
              order?.created_at
                ? format(new Date(order?.created_at), "dd/MM/yyyy HH:mm")
                : ""
            }`}</span>
          </div>
          <div style={{ marginTop: 4 }}>
            <span>Khách hàng: </span>
            <span style={{ fontWeight: 700 }}>{order.customer_name}</span>
          </div>
          <div style={{ marginTop: "0px !important" }}>
            <span
              style={{ color: "#333" }}
            >{`${order?.shipment?.phone} - ${order?.shipment?.address}`}</span>
          </div>
        </div>

        <div>
          <div style={{ marginTop: 4 }}>
            <span>Đối tác: </span>
            <span style={{ fontWeight: 700 }}>{order.partner_name}</span>
          </div>
          <div style={{ marginTop: "0px !important" }}>
            <span
              style={{ color: "#333" }}
            >{`${partner?.phone} - ${partner?.address}`}</span>
          </div>
        </div>
        <div>
          {cartItems.map((item: CartItem) => (
            <div
              key={item.created_at}
              className="h-stack h-stack-md"
              style={{ borderBottom: "1px solid #CBD5E0" }}
            >
              <img
                src={item.product.photo}
                alt={item.product.name}
                style={{ width: 48, height: 48 }}
              />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <div style={{ width: "40%" }}>
                  <div>{item.product.name}</div>
                  <div>
                    {`${(item.qty + (item.adjustment ?? 0)).toFixed(1)} x ${
                      item.product.unit ?? ""
                    }`}
                  </div>
                </div>
                <div
                  style={{
                    width: "35%",
                    marginTop: 10,
                  }}
                >
                  <Select
                    style={{ width: "100%" }}
                    defaultValue={item.status || status}
                    onChange={(e) => onChangeStatus(e, item)}
                  >
                    {StatusOrderList.map((item) => (
                      <option value={item} key={item}>
                        {item}
                      </option>
                    ))}
                  </Select>
                </div>
                <div style={{ width: "25%", textAlign: "right" }}>
                  <div>{formatMoney(item.unitPrice)} vnđ</div>
                  <div style={{ fontSize: "1.25rem" }}>
                    {formatMoney(
                      (item.qty + (item.adjustment ?? 0)) * item.unitPrice
                    )}{" "}
                    vnđ
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div
            className="h-stack"
            style={{
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div className="subtitle">Thành tiền</div>
            <div style={{ fontSize: "1.25rem" }}>{formatMoney(total)} vnđ</div>
          </div>
          <div
            className="h-stack"
            style={{
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div className="subtitle">Giảm giá</div>
            <div style={{ fontSize: "1.25rem" }}>
              {order.voucher ? formatMoney(order.voucher.value) : 0} vnđ
            </div>
          </div>
          <div
            className="h-stack"
            style={{
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div className="subtitle">Tổng thanh toán</div>
            <div style={{ fontSize: "1.25rem" }}>
              {formatMoney(total - (order.voucher ? order.voucher.value : 0))}{" "}
              vnđ
            </div>
          </div>
        </div>

        {/* {order.note && (
          <Alert message="Ghi chú" description={order.note} type="info" />
        )} */}
        {
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <p style={{ margin: 0, color: "#888" }}>Ghi chú</p>
              <Button
                size="small"
                color={"primary"}
                disabled={false}
                onClick={async () => {
                  await updateCustomerOrderNote(note, order?.id);
                  let orders = await getCustomerOrders();
                  dispatch(actions.setOrders(orders));
                  notification.success({
                    message: "Cập nhật thành công",
                    duration: 1,
                  });
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p style={{ marginRight: 4 }}>{"Cập nhật ghi chú "}</p>
                </div>
              </Button>
            </div>
            <TextArea
              style={{
                fontSize: 15,
              }}
              placeholder="Thời gian đặt hàng, giao nhận hàng, ..."
              // debounce={250}
              value={note}
              onChange={(e) => (setNote ? setNote(e.target.value) : null)}
            />
          </div>
        }
      </div>
    </Modal>
  );
};

const InventoryItems: React.FC<InventoryItemsProps> = ({ orders = [] }) => {
  let items = useMemo(() => {
    let items: Inventories = {};
    orders.forEach((order) => {
      order?.cart
        ? Object.values(order?.cart).forEach((item) => {
            if (!items[item.product.id]) {
              items[item.product.id] = {
                ...item.product,
                qty: item.qty + (item.adjustment ?? 0),
              };
            } else {
              items[item.product.id].qty += item.qty + (item.adjustment ?? 0);
            }
          })
        : null;
    });
    return Object.values(items);
  }, [orders]);

  return (
    <div className="v-stack-md">
      {items.map((item) => (
        <div
          key={item.id}
          className="h-stack h-stack-md"
          style={{ borderBottom: "1px solid #CBD5E0", paddingBottom: 4 }}
        >
          <img
            src={item.photo}
            alt={item.name}
            style={{ width: 48, height: 48 }}
          />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flex: 1,
            }}
          >
            <div style={{ width: "75%" }}>
              <div>{item.name}</div>
              <div>
                {item.qty + (item.adjustment ?? 0)} {item.unit ?? "kg"}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
const customerOrder = () => {
  let [showItemsModel, toggleItemsModel] = useToggle(false);
  let [status, setStatus] = useState("all");

  let [statusList, setStatusList] = useState(["all"]);

  let [searchText, setSearchText] = useState("");
  let [searchIDText, setSearchIDText] = useState("");
  let [statusSKUs, setStatusSKUs] = useState("");
  let partners = useSelector((state: RootState) => state.partners.list);

  // let { note, setNote } = useLocalStore((store) => store);

  let customerOrders = useSelector(
    (state: RootState) => state.customerOrders.list
  );
  let order = useSelector((state: RootState) => state.customerOrders.order);
  // if (order) {
  //   setNote(order.note || '');
  // }
  let token = useSelector((state: RootState) => state.user.token);
  let dispatch = useDispatch();
  const [dates, setDates] = useState<moment.Moment[]>([]);

  useEffect(() => {
    let fetchData = async () => {
      if (!token) return;
      try {
        let orders = await getCustomerOrders();
        dispatch(actions.setOrders(orders));
        const partners = await getPartners();
        dispatch(actionPartners.setPartners(partners));
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [token]);

  let filteredOrders = customerOrders
    .filter((o) =>
      statusList.length === 0 || statusList.includes("all")
        ? true
        : statusList.includes(o?.status ? o.status : "")
    )
    .filter((o) => (!searchText ? true : compare(searchText, o.partner_name)))
    .filter((o) => (!searchIDText ? true : compare(searchIDText, o.id)))
    .filter((o) =>
      !statusSKUs
        ? true
        : compare(statusSKUs, finalStatus(Object.values(o?.cart ? o.cart : {})))
    );
  if (dates.length && dates.length === 2 && dates[1]) {
    filteredOrders = filteredOrders.filter((item) => {
      const result = dates[0]
        .startOf("day")
        .isSameOrBefore(moment(item.created_at));
      const result2 = dates[1]
        .endOf("day")
        .isSameOrAfter(moment(item.created_at));
      return result && result2;
    });
  }

  filteredOrders = filteredOrders.map((order) => {
    const partnerArr = partners.filter((_partner) => {
      return _partner.id === order.partner_id;
    });
    const partner = partnerArr[0] || {};
    return { ...order, partner_address: partner.address };
  });

  //   created_at: "2020-11-12T03:28:09.898Z"
  // customer_id: "SyEzgjflpJp4mHe2jZ6w"
  // customer_name: "Chị kiều"
  // customer_photo: ""
  // discount_value: 0
  // id: "EH30000TL2011120002"
  // is_demo_account: false
  // note: ""
  // order_created_at: "2020-11-12T03:28:09.898Z"
  // partner_address: "60 Hoa Binh, p5, q11"
  // partner_daily_order_id: null
  // partner_id: "fcbVmNSgIDu9XQZ0ZmRx"
  // partner_name: "Tamy Luu"
  // partner_phone: "0902366238"
  // partner_photo: "https://api.itaphoa.com/photos/a568ec1a62a5e1da3b78b877410eb281"
  // ship_fee: 0
  // shipment: {name: "Chị kiều", phone: "0777938918", address: "19a đường số 19a bình hưng hòa a bình tân"}
  // status: "completed"
  // total: "0"
  // updated_at: "2020-11-17T08:23:28.352Z"
  // voucher: null

  let handleExportCsv = () => {
    let headers =
      "Đối tác\tPhone ĐT\tĐịa chỉ ĐT\tKhách hàng\tPhone KH\tĐịa chỉ KH\tMã đơn\tSố lượng\tThành tiền\tThành tiền Flash Sale\tVoucher\tNgày đặt\tNgày hoàn tất\tTrạng thái\tGhi chú" +
      "\r\n";
    let data = filteredOrders
      .reduce((acc: string[], row) => {
        let totalQty = row?.cart
          ? Object.values(row.cart).reduce(
              (sum, item) => sum + (item.qty + (item.adjustment ?? 0)),
              0
            )
          : 0;
        let totalPrice = row?.cart
          ? Object.values(row.cart).reduce(
              (sum, item) =>
                sum + (item.qty + (item.adjustment ?? 0)) * item.product.price,
              0
            )
          : 0;
        let totalPriceFlashSale = row?.cart
          ? Object.values(row.cart).reduce(
              (sum, item) =>
                sum + (item.qty + (item.adjustment ?? 0)) * item.unitPrice,
              0
            )
          : 0;
        let voucher = row.voucher ? row.voucher.value : 0;
        const array: string[] = [
          row?.partner_name || "",
          row?.partner_phone || "",
          row?.partner_address || "",
          row?.customer_name || "",
          row?.shipment?.phone || "",
          row?.shipment?.address || "",
          row?.id || "",
          totalQty.toString(),
          totalPrice.toString(),
          totalPriceFlashSale.toString(),
          voucher.toString(),
          row?.created_at ? format(new Date(row.created_at), "dd/MM/yyyy") : "",
          row?.updated_at ? format(new Date(row.updated_at), "dd/MM/yyyy") : "",
          row?.status || "",
          row?.note?.replace(/[\r\n]+/gm, ". ") || "",
        ];
        const str = array.join("\t");
        return acc.concat(str);
      }, [])
      .join("\r\n");
    fileDownload(headers + data, "report-orders.csv", "text/csv");

    headers = `Mã đơn\tSản phẩm\tSố lượng\tĐơn giá\r\n`;
    data = Object.values(
      filteredOrders.reduce((acc: string[], row) => {
        let items = [];
        if (row?.cart) {
          for (let v of Object.values(row.cart)) {
            items.push([row.id, v.product.name, v.qty, v.unitPrice].join("\t"));
          }
        }
        return acc.concat(items);
      }, [])
    ).join("\r\n");
    fileDownload(headers + data, "report-order-items.csv", "text/csv");
  };

  let handleExportTotalCsv = () => {
    let headers = `Mã sản phẩm\tTên sản phẩm\tKhối lượng\r\n`;
    let itemsExport: Inventories = {};
    filteredOrders.forEach((order) => {
      order?.cart
        ? Object.values(order.cart).forEach((item) => {
            if (!itemsExport[item.product.id]) {
              itemsExport[item.product.id] = {
                ...item.product,
                qty: item.qty + (item.adjustment ?? 0),
              };
            } else {
              itemsExport[item.product.id].qty +=
                item.qty + (item.adjustment ?? 0);
            }
          })
        : null;
    });

    let items = [];
    for (let v of Object.values(itemsExport)) {
      let qty = Math.round(parseFloat(v.qty.toString()) * 1000) / 1000;
      items.push([v.id, v.name, `${qty} ${v.unit ?? "kg"}`].join("\t"));
    }

    let dataExport = items.join("\r\n");
    fileDownload(
      headers + dataExport,
      "report-total-order-item.csv",
      "text/csv"
    );
  };

  const onDateFilter = () => {};
  const componentRef = useRef<LayoutPrint>(null);

  const plainOptions = [
    "all",
    "waiting",
    "processing",
    "completed",
    "canceled",
  ];

  const updateStatusList = (checkedList: string[]) => {
    setStatusList(checkedList);
  };

  let GMV = 0;
  for (let index = 0; index < filteredOrders.length; index++) {
    const row = filteredOrders[index];
    let totalPrice = row?.cart
      ? Object.values(row.cart).reduce(
          (sum, item) =>
            sum + (item.qty + (item.adjustment ?? 0)) * item.product.price,
          0
        )
      : 0;
    GMV = GMV + totalPrice;
  }

  let unitOrder = 0;

  let GMVAfterDiscount = 0;
  for (let index = 0; index < filteredOrders.length; index++) {
    const row = filteredOrders[index];
    let totalPrice = row?.cart
      ? Object.values(row.cart).reduce(
          (sum, item) =>
            sum + (item.qty + (item.adjustment ?? 0)) * item.unitPrice,
          0
        )
      : 0;
    unitOrder += row?.cart ? Object.values(row.cart).length : 0;
    GMVAfterDiscount = GMVAfterDiscount + totalPrice;
  }

  return (
    <>
      <div>
        <h1>Đơn đặt hàng</h1>
        <Card>
          <Row align="bottom" style={{ marginBottom: 16 }}>
            <Col span={4}>
              <Input.Search
                placeholder="Tìm theo đối tác"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Col>
            <Col span={4}>
              <Input.Search
                placeholder="Tìm mã đơn"
                value={searchIDText}
                onChange={(e) => setSearchIDText(e.target.value)}
              />
            </Col>

            <Col span={4}>
              <Select
                style={{ width: "100%" }}
                defaultValue={""}
                onChange={(e) => setStatusSKUs(e)}
              >
                {StatusOrderList.map((item) => (
                  <Select.Option value={item} key={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col span={12} style={{ textAlign: "right" }}>
              {/* <Radio.Group
                defaultValue={status}
                onChange={e => setStatus(e.target.value)}
              >
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="waiting">Waiting</Radio.Button>
                <Radio.Button value="processing">Processing</Radio.Button>
                <Radio.Button value="completed">Completed</Radio.Button>
                <Radio.Button value="canceled">Canceled</Radio.Button>
              </Radio.Group> */}
              <CheckboxGroup
                options={plainOptions}
                value={statusList}
                onChange={(checkboxValues) => {
                  const checkedList = checkboxValues.map((item) => {
                    return item.toString();
                  });
                  updateStatusList(checkedList);
                }}
              />
            </Col>

            <Col span={4} style={{ textAlign: "right" }}>
              <Button onClick={toggleItemsModel}>Xem tổng danh mục</Button>
            </Col>
            <Col span={2} style={{ textAlign: "right" }}>
              <Button onClick={handleExportCsv}>Export CSV</Button>
            </Col>
          </Row>
          <Row style={{ marginBottom: 16 }}>
            <RangePicker
              // defaultValue={[moment().subtract(7, 'days', moment()]}
              format={dateFormat}
              onCalendarChange={(dates) => {
                let filteredDate: moment.Moment[] = [];
                dates?.map((d) => {
                  if (d) filteredDate.push(d);
                });
                setDates(filteredDate);
              }}
            />
            {/* <Button style={{ marginLeft: 4 }} onClick={onDateFilter}>
              Filter
            </Button> */}
            {dates.length && dates.length === 2 && dates[1] ? (
              <div>
                <ReactToPrint
                  trigger={() => {
                    return <Button style={{ marginLeft: 4 }}>Print</Button>;
                  }}
                  content={() => (componentRef ? componentRef.current : null)}
                />
                <div style={{ display: "none" }}>
                  <LayoutPrint ref={componentRef} data={filteredOrders} />
                </div>
              </div>
            ) : null}
            <Col span={4} style={{ textAlign: "right" }}>
              <p style={{ marginBottom: 0 }}>{`GMV: ${formatMoney(GMV)}`}</p>
              <p style={{ marginBottom: 0 }}>
                {`GMV giá Flash Sale: ${formatMoney(GMVAfterDiscount)}`}
              </p>
            </Col>
            <Col span={4} style={{ textAlign: "right" }}>
              <p
                style={{ marginBottom: 0 }}
              >{`Số đơn: ${filteredOrders.length}`}</p>
              <p
                style={{ marginBottom: 0 }}
              >{`Số đơn theo unit: ${unitOrder}`}</p>
            </Col>
          </Row>
          <Table
            rowKey="id"
            dataSource={filteredOrders.map((order) => ({ ...order, partners }))}
            columns={columns}
          />
        </Card>
        <style jsx>{`
          h1 {
            font-size: 2rem;
          }
        `}</style>
      </div>
      <OrderModal />
      <Modal
        visible={showItemsModel}
        title="Xem tổng danh mục"
        onCancel={toggleItemsModel}
        width={640}
        footer={null}
      >
        <div style={{ position: "absolute", top: 10, right: 70 }}>
          <Button onClick={handleExportTotalCsv}>Export CSV</Button>
        </div>
        <InventoryItems orders={filteredOrders} />
      </Modal>
    </>
  );
};

export default customerOrder;
