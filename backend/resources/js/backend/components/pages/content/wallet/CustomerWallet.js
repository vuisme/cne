import { Table } from "antd";
import qs from "qs";
import moment from "moment";
import React, { useState, useEffect } from "react";
import { format } from "../../../../../../../public/backend/plugins/pdfmake/pdfmake";

// id, item_number, order_id, user_id, ItemId, Title, ProviderType, ItemMainUrl, MainPictureUrl, regular_price, weight, actual_weight, DeliveryCost, Quantity, hasConfigurators, shipped_by, shipping_from, shipping_type, shipping_rate, status, source_order_number, tracking_number, product_value, first_payment, coupon_contribution, bd_shipping_charge, courier_bill, out_of_stock, lost_in_transit, customer_tax, missing, adjustment, refunded, last_payment, due_payment, invoice_no, purchases_at, comment1, comment2, created_at, updated_at, deleted_at
const fixedColumns = [
    {
        title: "Date",
        dataIndex: "created_at",
        fixed: true,
        width: 130,
        render: (text, record, index) => {
            return moment(record.created_at).format("DD-MMM-YYYY ");
        },
    },
    {
        title: "TransactionNo",
        render: (item) => {
            return item.order.transaction_id;
        },
    },
    {
        title: "Order Number",
        dataIndex: "item_number",
    },
    {
        title: "Customer",
        render: (item) => {
            return item.order.name;
        },
    },
    {
        title: "Source Site",
        dataIndex: "ProviderType",
    },
    {
        title: "Shipping Method",
        dataIndex: "shipping_type",
    },
    {
        title: "Title",
        dataIndex: "Title",
    },
    {
        title: "Customer Phone",
        render: (item) => {
            return item.order.phone;
        },
    },
    {
        title: "Comment1",
        fixed: "right",
        dataIndex: "comment1",
    },
    {
        title: "Comment2",
        fixed: "right",
        dataIndex: "comment2",
    },
];

const getRandomuserParams = (params) => ({
    results: params.pagination?.pageSize,
    page: params.pagination?.current,
    ...params,
});

const CustomerWallet = () => {
    const [data, setData] = useState();
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
    });

    const fetchData = (params = {}) => {
        setLoading(true);
        fetch(
            `/admin/order/wallet/list/data?${qs.stringify(
                getRandomuserParams(params)
            )}`
        )
            .then((res) => res.json())
            .then(({ results, info }) => {
                setData(results);
                setLoading(false);
                setPagination({
                    ...params.pagination,
                    total: info.results, // 200 is mock data, you should read it from server
                    // total: data.totalCount,
                });
            });
    };

    useEffect(() => {
        fetchData({
            pagination,
        });
    }, []);

    const handleTableChange = (newPagination, filters, sorter) => {
        fetchData({
            sortField: sorter.field,
            sortOrder: sorter.order,
            pagination: newPagination,
            ...filters,
        });
    };

    return (
        <>
            <Table
                columns={fixedColumns}
                rowKey={(record) => record.id}
                dataSource={data}
                pagination={pagination}
                loading={loading}
                onChange={handleTableChange}
                scroll={{
                    x: 1200,
                    y: 500,
                }}
                bordered
            />
        </>
    );
};

export default CustomerWallet;
