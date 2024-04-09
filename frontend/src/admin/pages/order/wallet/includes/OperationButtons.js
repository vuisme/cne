import React, { useEffect, useState } from "react";
import { Button, Modal, Input } from "antd";
import { ExclamationCircleOutlined, FilterOutlined } from "@ant-design/icons";
import { useWalletBatchDelete } from "../../../../query/WalletApi";
import GenerateInvoice from "./GenerateInvoice";
import { has_permission } from "../../../../../api/Auth";

const { Search } = Input;


const OperationButtons = ({ selectedRowKeys, setResetQuery, handleSearch }) => {
  const [selected, setSelected] = useState([]);
  const [invoiceGen, setInvoiceGen] = useState(false);

  const { mutateAsync, isLoading } = useWalletBatchDelete();

  useEffect(() => {
    let selected_ids = [];
    selectedRowKeys.map((item) => {
      selected_ids.push(item.id);
      return 0;
    });
    setSelected(selected_ids);
  }, [selectedRowKeys]);

  const processDelete = () => {
    Modal.confirm({
      title: "Are you sure ?",
      icon: <ExclamationCircleOutlined />,
      content: "Attention! Selected items will be deleted.",
      okText: "Ok, Delete",
      okType: "danger",
      onOk: () => {
        mutateAsync(
          { selected },
          {
            onSuccess: () => {
              setResetQuery(true);
              setSelected([]);
            },
          }
        ).then((r) => console.log(r.data));
      },
      cancelText: "Cancel",
    });
  };
  const allowedStatus = ['received-in-BD-warehouse', 'lost_in_transit', 'cancel', 'out-of-stock'];
  const generateInvoice = () => {
    let same_users = true;
    let user_id = 0;
    for (let i = 0; i < selectedRowKeys.length; i++) {
      let item = selectedRowKeys[i];
      let user_id2 = item.user_id;
      if (item.invoice_no) {
        same_users = false;
        Modal.warning({
          title: "Processing error!",
          content: <p>#<b>{item.item_number}</b> Invoice already generate. <br /> Invoice No: #<b>{item.invoice_no}</b></p>,
        });
        break;
      } else if (!allowedStatus.includes(item.status)) {
        same_users = false;
        Modal.warning({
          title: "Processing error!",
          content: <p>#<b>{item.item_number}</b> has status "${item.status}", is not ready for generate Invoice</p>,
        });
        break;
      } else if (user_id > 0 && user_id2 !== user_id) {
        same_users = false;
        Modal.warning({
          title: "Processing error!",
          content: <p>#<b>{item.item_number}</b> is not same customer</p>,
        });
        break;
      }
      user_id = user_id2;
    }
    if (same_users) {
      setInvoiceGen(true);
    }
  };

  const can_invoice = has_permission('wallet.generate.invoice');
  const can_delete = has_permission('recent.order.delete');
  const hasSelected = selected.length > 0;

  return (
    <>
      {invoiceGen && hasSelected && can_invoice && (
        <GenerateInvoice
          rowItems={selectedRowKeys}
          setResetQuery={setResetQuery}
          show={invoiceGen}
          setShow={setInvoiceGen}
        />
      )}
      <div
        style={{
          marginBottom: 16,
        }}
      >
        {
          can_delete &&
          <Button
            type="danger"
            onClick={processDelete}
            disabled={!hasSelected}
            loading={isLoading}
            style={{ marginRight: 4 }}
          >
            Delete
          </Button>
        }
        {
          can_invoice &&
          <Button
            type="primary"
            onClick={generateInvoice}
            disabled={!hasSelected}
          >
            Generate Invoice
          </Button>
        }
        <span style={{ marginLeft: 8 }}>
          {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
        </span>
        <Search
          placeholder="Search"
          enterButton
          onChange={e => handleSearch(e.target.value)}
          onSearch={handleSearch}
          style={{
            width: 300,
          }}
        />
      </div>
    </>
  );
};

export default OperationButtons;
