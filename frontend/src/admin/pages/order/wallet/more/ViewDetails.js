import { Table, Typography, Modal, Divider, List, Image } from "antd";
import React, { useEffect, useState } from "react";
import { numParse, slugToMakeTitle } from "../../../../../utils/Helpers";
import ImageLoader from "../../../../../loader/ImageLoader";
import moment from "moment";

const { Title } = Typography;


const SummaryItem = ({ label, value }) => {
  return (
    <Table.Summary.Row>
      <Table.Summary.Cell index={0} colSpan={3} align="right">{label}</Table.Summary.Cell>
      <Table.Summary.Cell index={1} align="right">{value}</Table.Summary.Cell>
    </Table.Summary.Row>
  );
}

const ViewDetails = ({ walletItem, show, setShow }) => {
  const [variations, setVariations] = useState([]);

  useEffect(() => {
    setVariations(walletItem?.item_variations);
  }, [walletItem]);

  const MainPictureUrl = walletItem.MainPictureUrl;
  const shipping = walletItem?.order?.shipping ? JSON.parse(walletItem?.order?.shipping) : {};

  const sourceLink = () => {
    let ItemId = walletItem.ItemId;
    let link = `https://item.taobao.com/item.htm?id=${ItemId}`;
    if (walletItem.ProviderType === "aliexpress") {
      link = `https://www.aliexpress.com/item/${ItemId}.html`;
    }
    return link;
  };

  const internalSourceLink = () => {
    return walletItem.ProviderType === "Taobao"
      ? `/product/${walletItem.ItemId}`
      : `/aliexpress/product/${walletItem.ItemId}`;
  };


  const netProductValue = () => {
    let { product_value, DeliveryCost, coupon_contribution } = walletItem;
    return (Number(product_value) + Number(DeliveryCost) - Number(coupon_contribution));
  }
  const DaysCount = () => {
    let firstDate = moment();
    let secondDate = walletItem?.purchases_at ? moment(walletItem.purchases_at) : 0;
    let days_count = secondDate
      ? firstDate.diff(secondDate, "days", false)
      : 0;
    return days_count > 1
      ? `${days_count} Days`
      : `${days_count} Day`;
  }


  return (
    <>
      <Modal
        title={`Wallet Details #${walletItem.item_number}`}
        visible={show}
        onOk={() => setShow(false)}
        onCancel={() => setShow(false)}
        width={800}
        footer={false}
      >
        <List
          size="small"
          dataSource={[
            <Title level={5}>{walletItem.Title}</Title>,
            <div>
              ChinaExpress Link :{" "}
              <a
                href={internalSourceLink()}
                rel="noreferrer nofollow"
                target="_blank"
              >
                Click Here
              </a>
            </div>,
            `Provider : ${walletItem.ProviderType}`,
            <div>
              Source Link :{" "}
              <a href={sourceLink()} rel="noreferrer nofollow" target="_blank">
                Click Here
              </a>
            </div>,
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
        <Divider orientation="left">Variations</Divider>
        <Table
          rowKey={(record) => record.id}
          dataSource={variations}
          pagination={false}
          size="small"
          bordered
          columns={[
            {
              title: "SL",
              align: "center",
              width: 50,
              render: (text, record, index) => {
                return index + 1;
              },
            },
            {
              title: "Picture",
              align: "center",
              width: 80,
              dataIndex: "Variations",
              render: (Picture, record, index) => {
                let attributes = record.attributes
                  ? JSON.parse(record.attributes)
                  : [];
                let ImageUrl = attributes?.find(
                  (attr) => attr?.ImageUrl !== undefined
                )?.ImageUrl;

                return <ImageLoader path={ImageUrl ? ImageUrl : MainPictureUrl} />
              },
            },
            {
              title: "Variations",
              width: 180,
              dataIndex: "attributes",
              render: (attributes, record) => {
                const attr_data = attributes ? JSON.parse(attributes) : [];
                const variationList = attr_data?.map((attribute, key) => (
                  <p className="m-0" key={key}>
                    {attribute?.PropertyName +
                      ` : ` +
                      (attribute?.ValueAlias || attribute?.Value)}
                  </p>
                ));
                return (
                  <>
                    {variationList}
                    <p className="m-0"><b>{record.qty} x {record.price}</b></p>
                  </>
                );
              },
            },
            {
              title: "Total",
              align: "right",
              width: 80,
              dataIndex: "subTotal",
              render: (subTotal) => {
                return subTotal ? subTotal : 0;
              },
            },
          ]}
          summary={(pageData) => {
            return (
              <>
                <SummaryItem label="Total" value={walletItem.product_value} />
                <SummaryItem label="DeliveryCost" value={walletItem.DeliveryCost} />
                <SummaryItem label="Coupon Claim" value={walletItem.coupon_contribution || 0} />
                <SummaryItem label="Net Product Value" value={netProductValue()} />
                <SummaryItem label="1stPayment" value={walletItem.first_payment || 0} />
                <SummaryItem label="OutOfStock" value={walletItem.out_of_stock || 0} />
                <SummaryItem label="Missing / Cancel" value={walletItem.missing || 0} />
                <SummaryItem label="Lost in Transit" value={walletItem.lost_in_transit || 0} />
                <SummaryItem label="Refunded" value={walletItem.refunded || 0} />
                <SummaryItem label="Adjustment" value={walletItem.adjustment || 0} />
                <SummaryItem label="AliExpress Tax" value={walletItem.customer_tax || 0} />
                <SummaryItem label="Shipping Rate" value={walletItem.shipping_rate || 0} />
                <SummaryItem label="Total Weight" value={walletItem.actual_weight || 0} />
                <SummaryItem label="Weight Charges" value={walletItem.shipping_rate || 0} />
                <SummaryItem label="Courier Bill" value={walletItem.courier_bill || 0} />
                <SummaryItem label="Last Payment" value={walletItem.last_payment || 0} />
                <SummaryItem label="Closing Balance" value={walletItem.due_payment || 0} />
                <SummaryItem label="Ref. Invoice" value={walletItem.invoice_no || 0} />
                <SummaryItem label="Days Count" value={DaysCount()} />
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <p> <b>Comment1 :</b> {walletItem.comment1} </p>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
                <Table.Summary.Row>
                  <Table.Summary.Cell index={0} colSpan={4}>
                    <p> <b>Comment2 :</b> {walletItem.comment2} </p>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </>
            );
          }}
        />

        <Divider orientation="left">Customer Info</Divider>
        <List
          size="small"
          dataSource={[
            `Customer Name : ${walletItem?.order?.name || 'N/A'}`,
            `Customer Phone : ${walletItem?.order?.phone || 'N/A'}`,
            `Customer Email : ${walletItem?.user?.email || 'N/A'}`,
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />
        <Divider orientation="left">Shipping Details</Divider>
        <List
          size="small"
          dataSource={[
            `Name : ${shipping?.name || 'N/A'}`,
            `Phone : ${shipping?.phone || 'N/A'}`,
            `City : ${shipping?.city || 'N/A'}`,
            `Postcode : ${shipping?.postcode || 'N/A'}`,
            `Address : ${shipping?.address || 'N/A'}`,
          ]}
          renderItem={(item) => <List.Item>{item}</List.Item>}
        />

      </Modal>
    </>
  );
};

export default ViewDetails;
