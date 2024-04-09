import {Col, Card, Row, Divider} from 'antd';
import React from 'react';
import PriceForm1 from "./includes/PriceForm1";
import PriceForm2 from "./includes/PriceForm2";

const style = {
    background: '#0092ff',
    padding: '8px 0',
};

const PriceSetting = () => (
    <>
        <Row gutter={[16, 16]}>
            <Col span={8} xs={24} sm={24} md={12} lg={8}>
                <Card title="Price Settings">
                    <PriceForm1/>
                </Card>
            </Col>
            <Col span={8} xs={24} sm={24} md={12} lg={8}>
                <Card title="Ali Express Price Conversion Slab">
                    <PriceForm2/>
                </Card>
            </Col>
        </Row>
    </>
);

export default PriceSetting;
