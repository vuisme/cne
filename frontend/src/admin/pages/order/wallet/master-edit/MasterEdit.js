import {
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Form, Modal, Row, Col, Checkbox } from "antd";
import React from "react";
import InputPlain from "../../../../../components/input/InputPlain";
import InputTextArea from "../../../../../components/input/InputTextArea";
import SelectMasterStatus from "./includes/SelectMasterStatus";
import { useWalletMasterUpdate } from "../../../../query/WalletApi";

const MasterEdit = ({ walletItem, show, setShow, setResetQuery }) => {
  const [form] = Form.useForm();
  const wallet_id = walletItem?.id || null;

  const { mutateAsync, isLoading } = useWalletMasterUpdate(wallet_id);

  const onFinish = (values) => {
    mutateAsync(values, {
      onSuccess: () => {
        setResetQuery(true);
        setShow(false);
      },
    }).then((r) => console.log(r.data));
  };

  return (
    <Modal
      title={`Always be careful for Master Edit # ${walletItem.item_number}`}
      visible={show}
      onCancel={() => setShow(false)}
      icon={<ExclamationCircleOutlined />}
      width={600}
      footer={false}
    >
      <p style={{ color: "#ef2c34" }}>
        <b>Caution !</b> <br />
        This form is not for auto calculate, If you understand the wallet calculation, then you can use your manual calculator and place the value if you sure it.
      </p>
      <Form
        layout="vertical"
        form={form}
        name="status_change_form"
        onFinish={onFinish}
        initialValues={{ ...walletItem, calculate: true }}
      >
        <SelectMasterStatus
          label="Current Status"
          name="status"
          required={true}
          title="Status must not empty"
        />

        <Row gutter={[15, 15]}>
          <Col sm={12} md={8}>
            <InputPlain
              label="ProviderType"
              name="ProviderType"
              title="Product Provider Type"
              disabled={true}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              label="Shipping Type"
              name="shipping_type"
              title="Shipping Type"
              disabled={true}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              label="Source Order Number"
              name="source_order_number"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              label="Tracking Number"
              name="tracking_number"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Quantity"
              name="Quantity"
              required={true}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Product Value"
              title="Product actual value except china local delivery charges "
              name="product_value"
              required={true}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Local Delivery"
              title="China Local Delivery Charges"
              name="DeliveryCost"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Coupon Claim"
              title="Coupon Claim Amount"
              name="coupon_contribution"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="1stPayment"
              title="1st Payment Amount"
              name="first_payment"
              required={true}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Out Of Stock"
              title="Out Of Stock Amount"
              name="out_of_stock"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Missing / Cancel"
              title="Missing or Cancel Amount"
              name="missing"
              placeholder="Missing Amount"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Lost in Transit"
              title="Lost in transit affected amount"
              name="lost_in_transit"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Refunded"
              title="Refunded affected amount"
              name="refunded"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Adjustment"
              title="Adjustment affected amount"
              name="adjustment"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="AliExpress Tax"
              title="Customer Tax affected amount"
              name="customer_tax"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Shipping Rate"
              name="shipping_rate"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Total Weight"
              name="actual_weight"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Courier Bill"
              name="courier_bill"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Last Payment"
              name="last_payment"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              type="number"
              label="Closing Balance"
              name="due_payment"
              required={false}
            />
          </Col>
          <Col sm={12} md={8}>
            <InputPlain
              label="Ref. Invoice"
              title="Ref. Invoice Number"
              name="invoice_no"
              required={false}
            />
          </Col>
        </Row>

        <InputTextArea
          label="First Comment"
          placeholder="First Comment"
          name="Comment1"
          required={false}
        />

        <InputTextArea
          label="Second Comment"
          placeholder="Second Comment"
          name="comment2"
          required={false}
        />

        <InputPlain
          label="Product Title"
          title="Product title must not empty"
          name="Title"
        />

        <InputPlain
          label="Source Link"
          name="ItemMainUrl"
        />
        <Form.Item
          name="calculate"
          valuePropName="checked"
          wrapperCol={{
            offset: 0,
            span: 16,
          }}
        >
          <Checkbox>Calculate Wallet</Checkbox>
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Update
        </Button>
      </Form>
    </Modal>
  );
};

export default MasterEdit;
