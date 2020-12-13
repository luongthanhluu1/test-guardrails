import Link from "next/link";
import { Layout, Menu } from "antd";

export const Sider = () => (
  <Layout.Sider collapsible>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <img
        src="/logoMio.png"
        alt="iTAPHOA logo"
        style={{ height: 82, width: 82 }}
      />
    </div>

    <Menu theme="dark">
      <Menu.Item key="customer-orders">
        <Link href="/customer-orders">
          <a>Customer Orders</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="waiting-orders">
        <Link href="/waiting-orders">
          <a>Waiting Orders</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="suppliers">
        <Link href="/suppliers">
          <a>Suppliers</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="inventory">
        <Link href="/inventory">
          <a>Inventory</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="2">
        <Link href="/products">
          <a>Products</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="20">
        <Link href="/hot-products">
          <a>Hot product</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="4">
        <Link href="/partners">
          <a>Partners</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="5">
        <Link href="/chats">
          <a>Chats</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="6">
        <Link href="/vouchers">
          <a>Vouchers</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="7">
        <Link href="/posts">
          <a>Posts</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="Stations">
        <Link href="/stations">
          <a>Stations</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="Category">
        <Link href="/category">
          <a>Category</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="edit-product">
        <Link href="/edit-products">
          <a>Edit Product</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="flash-sale">
        <Link href="/flash-sale">
          <a>Flash Sale</a>
        </Link>
      </Menu.Item>
      <Menu.Item key="voucher-partner">
        <Link href="/voucher-partner">
          <a>Voucher partner</a>
        </Link>
      </Menu.Item>

      <Menu.Item key="review">
        <Link href="/review">
          <a>Reviews</a>
        </Link>
      </Menu.Item>

      <Menu.Item key="progress-bar">
        <Link href="/progress-bar">
          <a>Progress</a>
        </Link>
      </Menu.Item>

      <Menu.Item key="config">
        <Link href="/config">
          <a>Config</a>
        </Link>
      </Menu.Item>
      {/* <Menu.Item key='1'>
        <Link href='/customer-order'>
          <a>Reports (In-progress)</a>
        </Link>
      </Menu.Item> */}
    </Menu>
  </Layout.Sider>
);
