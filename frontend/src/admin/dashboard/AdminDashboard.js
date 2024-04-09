import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Typography } from "antd";
import React from "react";

const { Title } = Typography;

const staticTitle = (title_text, h = 4) => (
  <Title level={h}>{title_text}</Title>
);

const AdminDashboard = () => {
  return (
    <div className="site-statistic-demo-card">
      <Title level={3}>Dashboard Summary</Title>

      <Row gutter={24}>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Sales")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Payment Received")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Shipping Charges")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Customer Due")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Invoice Generated")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Refund")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Courier Charges")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title={staticTitle("Stock Value")}
              value={0}
              valueStyle={{
                color: "#3f8600",
              }}
              precision={2}
              prefix="৳"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;
