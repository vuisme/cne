import React from 'react';
import { Select, Form } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

const { Option } = Select;

const SelectMasterStatus = () => {

  let options = [
    { key: 1, statusKey: 'partial-paid', value: 'Partial Paid' },
    { key: 2, statusKey: 'purchased', value: 'Purchased' },
    { key: 3, statusKey: 'shipped-from-suppliers', value: 'Shipped from Suppliers' },
    { key: 4, statusKey: 'received-in-china-warehouse', value: 'Received in China Warehouse' },
    { key: 5, statusKey: 'shipped-from-china-warehouse', value: 'Shipped from China Warehouse' },
    { key: 6, statusKey: 'received-in-BD-warehouse', value: 'Received in BD Warehouse' },
    { key: 7, statusKey: 'cancel', value: 'Order Canceled' },
    { key: 8, statusKey: 'out-of-stock', value: 'Out of stock' },
    { key: 8, statusKey: 'missing', value: 'Missing or Shortage' },
    { key: 9, statusKey: 'adjusted-by-invoice', value: 'Adjustment by Invoice' },
    { key: 10, statusKey: 'lost_in_transit', value: 'Lost in Transit' },
    { key: 11, statusKey: 'customer_tax', value: 'Customer Tax' },
    { key: 12, statusKey: 'refunded', value: 'Refund to Customer' },
  ];

  return (
    <Form.Item
      label="Select Wallet Status"
      tooltip={{
        title: 'Select your status for change',
        icon: <InfoCircleOutlined />,
      }}
      name="status"
      rules={[
        {
          required: true,
          message: 'Please select status ',
        },
      ]}
    >
      <Select
        showSearch
        style={{ width: '100%' }}
        placeholder="Search to Select"
        optionFilterProp="children"
        filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
      >
        {
          options.map((opItem, key) => (
            <Option key={key} value={opItem.statusKey}>{opItem.value}</Option>
          ))
        }
      </Select>
    </Form.Item>
  );
};

export default SelectMasterStatus;