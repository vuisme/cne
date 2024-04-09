import React from 'react';
import { Typography } from "antd";
import InvoiceTable from './includes/InvoiceTable';

const { Title } = Typography;

const ManageInvoice = () => {
  return (
    <div>
      <Title level={4}>Manage Invoice</Title>
      <InvoiceTable />
    </div>
  );
};

export default ManageInvoice;