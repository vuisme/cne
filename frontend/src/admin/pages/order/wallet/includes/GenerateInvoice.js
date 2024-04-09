import {
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import {
  Button,
  Checkbox,
  Col,
  Divider,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Table,
} from "antd";
import {
  characterLimiter,
  collectionSumCalculate,
} from "../../../../../utils/Helpers";
import {useWalletInvoiceGenerate} from "../../../../query/WalletApi";

const {Option} = Select;

const GenerateInvoice = ({rowItems, setResetQuery, show, setShow}) => {
  const [form] = Form.useForm();

  const {mutateAsync, isLoading} = useWalletInvoiceGenerate();

  const total_due = collectionSumCalculate(rowItems, "due_payment");
  const total_weight = collectionSumCalculate(rowItems, "actual_weight");

  const courierBillCalculate = (event) => {
    let bill_amount = event.target.value;
    let payable_amount = Number(total_due) + Number(bill_amount);
    form.setFieldsValue({payable_amount});
  };

  const onFinish = (values) => {
    mutateAsync({invoices: rowItems, related: {...values, user_id: rowItems[0].user_id}}, {
      onSuccess: () => {
        setResetQuery(true);
        setShow(false);
      },
    }).then((r) => console.log(r.data));
  };

  return (
    <Modal
      title={`Generate Customer Invoices!`}
      visible={show}
      onCancel={() => setShow(false)}
      icon={<ExclamationCircleOutlined/>}
      width={800}
      footer={false}
    >
      <Table
        rowKey={(record) => record.id}
        dataSource={rowItems}
        pagination={false}
        size="small"
        bordered
        summary={(pageData) => {
          return (
            <Table.Summary>
              <Table.Summary.Row>
                <Table.Summary.Cell align="right" colSpan={4} index={0}>
                  Total
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={1}>
                  {Number(total_weight).toFixed(3)}
                </Table.Summary.Cell>
                <Table.Summary.Cell align="right" index={2}>
                  {total_due}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </Table.Summary>
          );
        }}
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
            title: "Order Number",
            align: "center",
            width: 80,
            dataIndex: "item_number",
          },
          {
            title: "Title",
            dataIndex: "Title",
            render: (Title) => {
              let sortTitle = characterLimiter(Title, 35);
              return <span title={Title}>{sortTitle}</span>;
            },
          },
          {
            title: "Status",
            width: 160,
            dataIndex: "status",
          },
          {
            title: "Weight",
            align: "right",
            width: 70,
            dataIndex: "actual_weight",
          },
          {
            title: "Due",
            align: "right",
            width: 80,
            dataIndex: "due_payment",
          },
        ]}
      />
      <Divider orientation="left">Invoice Information</Divider>
      <Form
        layout="vertical"
        form={form}
        name="status_change_form"
        onFinish={onFinish}
        initialValues={{
          payment_method: "cash-on-office",
          delivery_method: "office_delivery",
          courier_bill: 0,
          payable_amount: total_due,
          notify_customer: true,
        }}
      >
        <Row gutter={16}>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={"Payment Method"}
              tooltip={{
                title: `Select Payment Method `,
                icon: <InfoCircleOutlined/>,
              }}
              name="payment_method"
              rules={[
                {
                  required: true,
                  message: "Select Payment Method",
                },
              ]}
            >
              <Select placeholder="Select Method">
                <Option value="cash-on-office">Cash on Office</Option>
                <Option value="bkash">Bkash</Option>
                <Option value="cash-on-delivery">Cash on Delivery</Option>
                <Option value="Bank">Bank</Option>
                <Option value="SSLcommerz">SSLcommerz</Option>
                <Option value="Nagod">Nagod</Option>
                <Option value="Rocket">Rocket</Option>
                <Option value="Others">Others</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={"Delivery Method"}
              tooltip={{
                title: `Select Delivery Method `,
                icon: <InfoCircleOutlined/>,
              }}
              name="delivery_method"
              rules={[
                {
                  required: true,
                  message: "Select Delivery Method",
                },
              ]}
            >
              <Select placeholder="Select Delivery Method">
                <Option value="office_delivery">Office Delivery</Option>
                <Option value="sundarban">Sundarban</Option>
                <Option value="sa-poribohon">SA Poribohon</Option>
                <Option value="papperfly">Papperfly</Option>
                <Option value="pathao">Pathao</Option>
                <Option value="tiger">Tiger</Option>
                <Option value="others">Others</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={"Courier Bill"}
              tooltip={{
                title: `Input Courier Bill `,
                icon: <InfoCircleOutlined/>,
              }}
              name="courier_bill"
              rules={[
                {
                  required: true,
                  message: "Input Courier Bill",
                },
              ]}
            >
              <Input
                placeholder="0.00"
                align="right"
                onChange={courierBillCalculate}
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={6}>
            <Form.Item
              label={"Total Payable"}
              tooltip={{
                title: `Invoice payable Amount`,
                icon: <InfoCircleOutlined/>,
              }}
              name="payable_amount"
            >
              <Input placeholder="0.00" align="right" disabled/>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="notify_customer"
          valuePropName="checked"
          wrapperCol={{
            offset: 0,
            span: 16,
          }}
        >
          <Checkbox>Notify Customer</Checkbox>
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={isLoading}>
          Generate Invoice
        </Button>
      </Form>
    </Modal>
  );
};

export default GenerateInvoice;
