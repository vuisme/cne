import React, { useEffect, useState } from "react";
import { Button, Dropdown, Table } from "antd";
import moment from "moment/moment";
import {
  capitalizeFirstLetter,
  characterLimiter,
} from "../../../../utils/Helpers";
import Action from "./more/Action";
import { SettingOutlined } from "@ant-design/icons";
import { useWalletData } from "../../../query/WalletApi";
import qs from "qs";
import { useQueryClient } from "react-query";
import OperationButtons from "./includes/OperationButtons";

const getRandomParams = (params) => ({
  results: params.pagination?.pageSize,
  page: params.pagination?.current,
  ...params,
});

const WalletTable = ({ handleActionClick, resetQuery, setResetQuery, canMasterEdit }) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [data, setData] = useState();
  const [loadSearch, setLoadSearch] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
  });
  const [queryParams, setQueryParams] = useState({});

  const qs_query_prams = qs.stringify(getRandomParams(queryParams));

  const cache = useQueryClient();
  const { data: queryData, isLoading } = useWalletData(qs_query_prams);

  useEffect(() => {
    if (resetQuery) {
      cache.invalidateQueries(["wallet", qs_query_prams]);
      setResetQuery(false);
      setSelectedRowKeys([]);
    }

  }, [resetQuery, cache, qs_query_prams, setResetQuery]);


  useEffect(() => {
    setData(queryData?.data);
    setPagination({
      ...queryParams.pagination,
      total: queryData?.totalRecords || 0,
    });
  }, [queryData, queryParams]);

  const handleTableChange = (newPagination, filters, sorter) => {
    setQueryParams({
      sortField: sorter.field,
      sortOrder: sorter.order,
      pagination: newPagination,
      ...filters,
    });
  };

  const handleSearch = (search) => {
    if (search !== loadSearch) {
      setLoadSearch(search);
      setPagination({
        current: 1,
        pageSize: 10,
      })
      setQueryParams({ ...queryParams, search });
    }
  };

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRows);
    },
  };

  return (
    <>
      <OperationButtons
        selectedRowKeys={selectedRowKeys}
        setResetQuery={setResetQuery}
        handleSearch={handleSearch}
      />
      <Table
        rowSelection={rowSelection}
        rowKey={(record) => record.id}
        dataSource={data}
        pagination={pagination}
        loading={isLoading}
        onChange={handleTableChange}
        onRow={(record, rowIndex) => {
          return {
            onDoubleClick: (event) => handleActionClick(event, "change-status", record),
          };
        }}
        scroll={{
          x: 1200,
          y: 600,
        }}
        bordered
        columns={[
          {
            title: "Date",
            dataIndex: "created_at",
            fixed: "left",
            align: "center",
            width: 120,
            // defaultSortOrder: 'descend',
            // sorter: (a, b) => {
            //   return true;
            // },
            render: (text, record,) => {
              return record?.created_at
                ? moment(record.created_at).format("DD-MMM-YYYY")
                : "N/A";
            },
          },
          {
            title: "Customer",
            fixed: "left",
            width: 190,
            render: (item) => {
              return item?.order?.name || 'N/A';
            },
          },
          {
            title: "Order Number",
            align: "center",
            fixed: "left",
            width: 100,
            dataIndex: "item_number",
          },
          {
            title: "Status",
            align: "center",
            fixed: "left",
            width: 130,
            dataIndex: "status",
            filters: [
              { text: 'Partial Paid', value: 'partial-paid', },
              { text: 'Purchased', value: 'purchased', },
              { text: 'Shipped from Suppliers', value: 'shipped-from-suppliers', },
              { text: 'Received in China Warehouse', value: 'received-in-china-warehouse', },
              { text: 'Shipped from China Warehouse', value: 'shipped-from-china-warehouse', },
              { text: 'Received in BD Warehouse', value: 'received-in-BD-warehouse', },
              { text: 'Order Canceled', value: 'cancel', },
              { text: 'Out of stock', value: 'out-of-stock', },
              { text: 'Missing or Cancel', value: 'missing', },
              { text: 'Adjusted by Invoice', value: 'adjusted-by-invoice', },
              { text: 'Lost in Transit', value: 'lost_in_transit', },
              { text: 'Customer Tax', value: 'customer_tax', },
              { text: 'Refund to Customer', value: 'refunded', },
              { text: 'Delivered', value: 'delivered', },
            ],
            filterMode: 'tree',
            filterSearch: true,
            onFilter: (value, record) => {
              return true;
            }
          },
          {
            title: "Transaction Number",
            // fixed: "left",
            width: 190,
            render: (item) => {
              return item?.order?.transaction_id || 'N/A';
            },
          },
          {
            title: "Source Site",
            align: "center",
            // fixed: "left",
            width: 110,
            dataIndex: "ProviderType",
            render: (ProviderType) => {
              return ProviderType ? capitalizeFirstLetter(ProviderType) : "N/A";
            },
          },
          {
            title: "Shipping Method",
            align: "center",
            width: 100,
            dataIndex: "shipping_type",
            render: (shipping_type) => {
              return shipping_type
                ? capitalizeFirstLetter(shipping_type)
                : "Express";
            },
          },
          {
            title: "Source Order Number",
            align: "center",
            width: 180,
            dataIndex: "source_order_number",
            render: (item_value) => {
              return item_value ? item_value : "N/A";
            },
          },
          {
            title: "TrackingNo",
            width: 160,
            dataIndex: "tracking_number",
            render: (item_value) => {
              return item_value ? item_value : "N/A";
            },
          },
          {
            title: "Title",
            width: 250,
            dataIndex: "Title",
            render: (Title) => {
              return characterLimiter(Title, 45);
            },
          },
          {
            title: "Source Link",
            width: 150,
            align: "center",
            dataIndex: "ItemId",
            render: (ItemId, record) => {
              let link = `https://item.taobao.com/item.htm?id=${ItemId}`;
              if (record.ProviderType === "aliexpress") {
                link = `https://www.aliexpress.com/item/${ItemId}.html`;
              }
              return (
                <a href={link} rel="noreferrer nofollow" target="_blank">
                  Click
                </a>
              );
            },
          },
          {
            title: "Quantity",
            width: 90,
            align: "center",
            dataIndex: "Quantity",
          },
          {
            title: "Product Value",
            width: 100,
            align: "center",
            dataIndex: "product_value",
          },
          {
            title: "Local Delivery",
            width: 100,
            align: "center",
            dataIndex: "DeliveryCost",
          },
          {
            title: "Coupon Claim",
            width: 100,
            align: "center",
            dataIndex: "coupon_contribution",
            render: (coupon_contribution) => {
              return coupon_contribution ? coupon_contribution : 0;
            },
          },
          {
            title: "Net Product Value",
            width: 120,
            align: "center",
            dataIndex: "product_value",
            render: (product_value, record) => {
              let { DeliveryCost, coupon_contribution } = record;
              return (
                Number(product_value) +
                Number(DeliveryCost) -
                Number(coupon_contribution)
              );
            },
          },
          {
            title: "1stPayment",
            width: 110,
            align: "center",
            dataIndex: "first_payment",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "OutOfStock",
            width: 110,
            align: "center",
            dataIndex: "out_of_stock",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Missing / Cancel",
            width: 110,
            align: "center",
            dataIndex: "missing",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Lost in Transit",
            width: 110,
            align: "center",
            dataIndex: "lost_in_transit",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Refunded",
            width: 100,
            align: "center",
            dataIndex: "refunded",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Adjustment",
            width: 110,
            align: "center",
            dataIndex: "adjustment",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "AliExpress Tax",
            width: 100,
            align: "center",
            dataIndex: "customer_tax",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Shipping Rate",
            align: "center",
            width: 90,
            dataIndex: "shipping_rate",
          },
          {
            title: "Total Weight",
            width: 100,
            align: "center",
            dataIndex: "actual_weight",
            render: (actual_weight) => {
              return Number(actual_weight).toFixed(3);
            },
          },
          {
            title: "Weight Charges",
            width: 100,
            align: "center",
            dataIndex: "shipping_rate",
            render: (shipping_rate, record) => {
              let { actual_weight } = record;
              return Math.round(Number(actual_weight) * Number(shipping_rate));
            },
          },
          {
            title: "Courier Bill",
            width: 100,
            align: "center",
            dataIndex: "courier_bill",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Last Payment",
            width: 100,
            align: "center",
            dataIndex: "last_payment",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Closing Balance",
            width: 100,
            align: "center",
            dataIndex: "due_payment",
            render: (item_value) => {
              return item_value ? item_value : 0;
            },
          },
          {
            title: "Ref. Invoice",
            width: 100,
            align: "center",
            dataIndex: "invoice_no",
            render: (item_value) => {
              return item_value ? item_value : "N/A";
            },
          },
          {
            title: "Days Count",
            width: 100,
            align: "center",
            dataIndex: "purchases_at",
            render: (purchases_at) => {
              let firstDate = moment();
              let secondDate = purchases_at ? moment(purchases_at) : 0;
              let days_count = secondDate
                ? firstDate.diff(secondDate, "days", false)
                : 0;
              return days_count > 1
                ? `${days_count} Days`
                : `${days_count} Day`;
            },
          },
          {
            title: "Comment1",
            width: 250,
            dataIndex: "comment1",
          },
          {
            title: "Comment2",
            width: 250,
            dataIndex: "comment2",
          },
          {
            title: "Action",
            fixed: "right",
            width: 75,
            key: "action",
            align: "center",
            render: (walletItem) => (
              <Dropdown
                overlay={
                  <Action
                    walletItem={walletItem}
                    handleActionClick={handleActionClick}
                    canMasterEdit={canMasterEdit}
                  />
                }
                placement="bottomRight"
              >
                <Button type="link" onClick={(e) => e.preventDefault()} icon={<SettingOutlined />} />
              </Dropdown>
            ),
          },
        ]}
      />
    </>
  );
};

export default WalletTable;
