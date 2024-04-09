import React, { useState } from "react";
import { Layout, Menu } from "antd";
import { PieChartOutlined } from "@ant-design/icons";
import { useSettings } from "../../../api/GeneralApi";
import { Link, useHistory, useLocation } from "react-router-dom";

const { Sider } = Layout;

const items = [
  {
    label: "Dashboard",
    key: "/manage/dashboard",
    icon: <PieChartOutlined />,
  },
  {
    label: "Manage Orders",
    key: "/manage/order",
    icon: <PieChartOutlined />,
    children: [
      {
        label: "Recent Orders",
        key: "/manage/order/recent",
      },
      {
        label: "Manage Wallet",
        key: "/manage/order/wallet",
      },
      {
        label: "Manage Invoice",
        key: "/manage/order/invoice",
      },
      {
        label: "Tracking Info",
        key: "/manage/order/tracking",
      },
    ],
  },
  {
    label: "Manage Products",
    key: "/manage/product/list",
    icon: <PieChartOutlined />,
  },
  {
    label: "Manage Coupons",
    key: "/manage/coupon",
    icon: <PieChartOutlined />,
    children: [
      {
        label: "Coupon Logs",
        key: "/manage/coupon/logs",
      },
      {
        label: "Manage Coupon",
        key: "/manage/coupon/list",
      },
    ],
  },
  {
    label: "Customer",
    key: "/manage/customer",
    icon: <PieChartOutlined />,
  },
  {
    label: "Manage Menus",
    key: "/manage/menu",
    icon: <PieChartOutlined />,
  },
  {
    label: "Manage Categories",
    key: "/manage/taxonomy",
    icon: <PieChartOutlined />,
  },
  {
    label: "Contact Message",
    key: "/manage/contact",
    icon: <PieChartOutlined />,
  },
  {
    label: "Manage Pages",
    key: "/manage/pages",
    icon: <PieChartOutlined />,
  },
  {
    label: "Manage FAQ",
    key: "/manage/faqs",
    icon: <PieChartOutlined />,
  },
  {
    label: "Frontend Settings",
    key: "5",
    icon: <PieChartOutlined />,
    children: [
      {
        label: "Top Notice",
        key: "/manage/front-setting/top-notice",
      },
      {
        label: "Announcements",
        key: "/manage/front-setting/announcement",
      },
      {
        label: "Manage Banners",
        key: "/manage/front-setting/banner",
      },
      {
        label: "Promotional Banner",
        key: "/manage/front-setting/promo-banner",
      },
      {
        label: "Manage Sections",
        key: "/manage/front-setting/sections",
      },
      {
        label: "Image Loaders",
        key: "/manage/front-setting/image-loading",
      },
    ],
  },
  {
    label: "System Settings",
    key: "6",
    icon: <PieChartOutlined />,
    children: [
      {
        label: "General Settings",
        key: "/manage/setting/general",
      },
      {
        label: "Price Settings",
        key: "/manage/setting/price",
      },
      {
        label: "Order Limitation",
        key: "/manage/setting/order-limit",
      },
      {
        label: "Popup Messages",
        key: "/manage/setting/popup",
      },
      {
        label: "Block Words",
        key: "/manage/setting/block-words",
      },
      {
        label: "Messages Settings",
        key: "/manage/setting/messages",
      },
      {
        label: "Cache Control",
        key: "/manage/setting/cache-control",
      },
      {
        label: "Bkash API Response",
        key: "/manage/setting/bkash-api-response",
      },
    ],
  },
  {
    label: "System Manage",
    key: "7",
    icon: <PieChartOutlined />,
    children: [
      {
        label: "Access",
        key: "/manage/setting/access",
        children: [
          {
            label: "User Management",
            key: "/manage/user",
          },
          {
            label: "Role Management",
            key: "/manage/role",
          },
          {
            label: "Bkash Refund Payment",
            key: "/manage/bkash/refund",
          },
        ],
      },
      {
        label: "Log Viewer",
        key: "/manage/log/viewer",
        children: [
          {
            label: "Log Dashboard",
            key: "/manage/log/dashboard",
          },
          {
            label: "Error Logs",
            key: "/manage/log/error-list",
          },
        ],
      },
    ],
  },
];

const AdminSidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();
  const history = useHistory();
  const { data: settings } = useSettings();

  const clickReceive = ({ key }) => {
    history.push(key);
  };

  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="logo">
        <img
          src={"/assets/img/logo/chinaexpress.png"}
          alt={settings?.site_name}
        />
      </div>
      <Menu
        theme="dark"
        onClick={clickReceive}
        defaultSelectedKeys={location.pathname}
        mode="inline"
        items={items}
      />
    </Sider>
  );
};

export default AdminSidebar;
