import { Form, Modal, Button } from "antd";
import React, { useEffect, useState } from "react";
import SelectStatus from "./include/SelectStatus";
import OutOfStockInput from "./include/OutOfStockInput";
import RefundedInput from "./include/RefundedInput";
import InputPlain from "../../../../../components/input/InputPlain";
import InputTextArea from "../../../../../components/input/InputTextArea";
import { cancelComment, cancelMissingAmt } from "./include/walletHelpers";

const ChangeStatus = ({ walletItem, onFinish, show, setShow, isLoading }) => {
  const [form] = Form.useForm();

  const [status, setStatus] = useState('');

  useEffect(() => {
    let current_status = walletItem?.status || '';
    if (current_status === 'lost_in_transit') {
      form.setFieldsValue({
        ...walletItem,
        lost_in_transit: cancelMissingAmt(walletItem),
      });
    } else if (current_status === 'cancel') {
      form.setFieldsValue({
        ...walletItem,
        comment: cancelComment(walletItem, current_status),
        missing: cancelMissingAmt(walletItem),
      });
    } else {
      form.setFieldsValue(walletItem);
    }
    setStatus(current_status);
  }, [walletItem])

  return (
    <>
      <Modal
        title={`Changes Status #${walletItem.item_number}`}
        okText="Change Status"
        visible={show}
        onCancel={() => setShow(false)}
        footer={null}
      >
        <Form
          layout="vertical"
          form={form}
          name="status_change_form"
          onFinish={onFinish}
        >
          <SelectStatus
            form={form}
            status={status}
            setStatus={setStatus}
            walletItem={walletItem}
          />
          {status === "purchased" && (
            <InputPlain
              label="Source Order Number"
              title="Source Order Number"
              name="source_order_number"
              required={true}
              message="Input your Source Order Number"
              placeholder="Source Order Number"
            />
          )}
          {status === "shipped-from-suppliers" && (
            <InputPlain
              label="Tracking Number"
              title="Tracking Number"
              name="tracking_number"
              required={true}
              message="Input Tracking Number"
              placeholder="Tracking Number"
            />
          )}
          {status === "received-in-BD-warehouse" && (
            <InputPlain
              type="number"
              required={true}
              label="Actual Weight"
              title="Actual Weight"
              name="actual_weight"
              message="Input Actual Weight"
              placeholder="Actual Weight"
            />
          )}
          {status === "out-of-stock" && (
            <OutOfStockInput
              form={form}
              walletItem={walletItem}
            />
          )}
          {status === "missing" && (
            <InputPlain
              type="number"
              required={true}
              label="Missing or Shortage"
              title="Missing or Shortage Amount item"
              name="missing"
              message="Input Missing Amount"
              placeholder="Missing Amount"
            />
          )}
          {status === "adjustment" && (
            <InputPlain
              type="number"
              required={true}
              label="Adjustment"
              title="Adjustment Amount(+/-) of this item"
              name="adjustment"
              message="Input Adjustment"
              placeholder="Adjustment"
            />
          )}
          {status === "lost_in_transit" && (
            <InputPlain
              type="number"
              required={true}
              label="Max value of lost"
              title="Lost in Transit"
              name="lost_in_transit"
              message="Input Max value of lost"
              placeholder="Max value of lost"
            />
          )}
          {status === "customer_tax" && (
            <InputPlain
              type="number"
              required={true}
              label="Customer Tax"
              title="Customer Tax Amount"
              name="customer_tax"
              message="Input Customer Tax Amount"
              placeholder="Input Tax Amount"
            />
          )}
          {status === "refunded" && <RefundedInput form={form} walletItem={walletItem} />}

          {status === "cancel" && (
            <>
              <InputPlain
                type="number"
                required={true}
                label="Amount will affected"
                title="Amount will affected"
                name="missing"
                message="Input Amount will affected"
                placeholder="Affected Amount"
              />
              <InputTextArea
                required={true}
                label="Cancel Comment"
                title="Cancel Comment"
                name="comment"
                message="Input Cancel Comment"
                maxLength={100}
                placeholder="Cancel Comment" />
            </>
          )}
          {status === "comment1" && (
            <InputTextArea
              required={true}
              label="First Comment"
              title="First Comment"
              name="comment1"
              message="Input First Comment"
              maxLength={300}
              placeholder="First Comment" />
          )}
          {status === "comment2" && (
            <InputTextArea
              required={true}
              label="Second Comment"
              title="First Comment"
              name="comment2"
              message="Input Second Comment"
              maxLength={300}
              placeholder="Second Comment" />
          )}
          <Button type="primary" htmlType="submit" block loading={isLoading}>
            Update Status
          </Button>
        </Form>
      </Modal>
    </>
  );
};

export default ChangeStatus;
