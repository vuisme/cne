import {InfoCircleOutlined} from '@ant-design/icons';
import {Button, Checkbox, Form, Input, InputNumber, Select} from 'antd';
import React from 'react';

const PriceForm1 = () => {
    const onFinish = (values) => {
        console.log('Success:', values);
    };

    const onFinishFailed = (errorInfo) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            name="basic"
            layout='vertical'
            initialValues={{
                remember: true,
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
        >
            <Form.Item
                label="Website Currency Icon"
                name="currency_icon"
            >
                <Select
                    label="Website Currency Icon"
                    defaultValue="BDT"
                >
                    <Option value="৳">BDT(৳)</Option>
                    <Option value="BDT">BDT</Option>
                    <Option value="$">Dollar($)</Option>
                </Select>
            </Form.Item>

            <Form.Item
                label="Taobao Base Currency"
                name="base_currency"
                required
                tooltip="This is a required field"
            >
                <Input disabled={true} defaultValue={'CNY'}/>
            </Form.Item>

            <Form.Item
                label="Taobao Currency Rate After Increase"
                name="increase_rate"
                tooltip="This rate will multiple the CNY price and 1 CNY to BDT. 13.02"
                required
            >
                <InputNumber style={{
                    width: '100%',
                }} min={0} max={100} placeholder="Taobao Base Currency"/>
            </Form.Item>

            <Form.Item
                label="AliExpress Base Currency"
                name="ali_base_currency"
                value="ali_base_currency"
                tooltip="This is the base currency of AliExpress."
                required
            >
                <Input disabled={true} defaultValue={'Us Dollar'}/>
            </Form.Item>

            <Form.Item
                label="AliExpress Currency Rate After Increase"
                name="ali_increase_rate"
                tooltip="This rate will multiple the Us Dollar price and 1 Us Dollar to BDT. 87.00"
                required
            >
                <InputNumber style={{
                    width: '100%',
                }} min={0} max={100} placeholder="Taobao Base Currency"/>
            </Form.Item>

            <Form.Item
            >
                <Button type="primary" block={true} htmlType="submit">
                    Submit
                </Button>
            </Form.Item>
        </Form>
    );
};

export default PriceForm1;
