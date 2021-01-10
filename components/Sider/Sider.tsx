import Link from "next/link";
import { Layout, Menu } from "antd";
import useTranslation from "next-translate/useTranslation";

import { ROUTER } from "consts/router";
import { RootState } from "stores";
import { useSelector } from "react-redux";
import { Role } from "models/User";

export const Sider = () => {
  const { t } = useTranslation("common");
  const user = useSelector((state: RootState) => state.user);
  return (
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
        {user?.role === Role.ADMIN && (
          <>
            <Menu.Item key="dashboard">
              <Link href={ROUTER.dashboard}>
                <a>{t("dashboard")}</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="debt">
              <Link href="/debt">
                <a>{t("debt")}</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="user">
              <Link href="/user">
                <a>{t("user")}</a>
              </Link>
            </Menu.Item>
          </>
        )}
        <Menu.Item key="item">
          <Link href={ROUTER.item}>
            <a>{t("item")}</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="tag">
          <Link href="/tag">
            <a>{t("tag")}</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="location">
          <Link href={ROUTER.location}>
            <a>{t("location")}</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="contact">
          <Link href={ROUTER.contact}>
            <a>{t("contact")}</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="order">
          <Link href={ROUTER.order}>
            <a>{t("order")}</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="workflow">
          <Link href="/workflow">
            <a>{t("workflow")}</a>
          </Link>
        </Menu.Item>
        <Menu.Item key="warehouse">
          <Link href="/warehouse">
            <a>{t("warehouse manager")}</a>
          </Link>
        </Menu.Item>
      </Menu>
    </Layout.Sider>
  );
};
