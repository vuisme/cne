import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
const { TextArea } = Input;

const InputTextArea = ({ label, title, name, required, message, placeholder, maxLength, minRows, maxRows }) => {

  return (
    <Form.Item
      label={label}
      tooltip={{
        title: title,
        icon: <InfoCircleOutlined />,
      }}
      name={name}
      rules={[
        {
          required: required,
          message: message,
        },
      ]}
    >
      <TextArea
        placeholder={placeholder}
        maxLength={maxLength ? maxLength : 200}
        autoSize={{
          minRows: minRows ? minRows : 3,
          maxRows: maxRows ? maxRows : 5,
        }} />
    </Form.Item>
  );
};

export default InputTextArea;
