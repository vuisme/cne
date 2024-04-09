import {MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Layout} from "antd";
import React, {useState} from "react";
import AdminSidebar from "./includes/AdminSidebar";

import "./antd.css";
import "./scss/Admin.scss";

const {Header, Content, Footer} = Layout;

const AdminLayout = ({children}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <AdminSidebar collapsed={collapsed} setCollapsed={setCollapsed}/>

      <Layout className="site-layout">
        <Header
          className="site-layout-background"
          style={{
            padding: "0 15px",
          }}
        >
          {React.createElement(
            collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
            {
              className: "trigger",
              onClick: () => setCollapsed(!collapsed),
            }
          )}
        </Header>
        <Content
          style={{
            margin: "0 16px",
          }}
        >
          <div
            className="site-layout-background"
            style={{
              margin: "16px 0",
              padding: 24,
              minHeight: 360,
            }}
          >
            {children}
          </div>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          ChinaExpress ©2018 Created by Sumon Ahmed
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
