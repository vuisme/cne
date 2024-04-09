import { InfoCircleOutlined } from "@ant-design/icons";
import { Form, Input } from "antd";
import InputNumberField from "./includes/InputNumberField";


const InputPlain = ({ label, title, name, required, message, placeholder, type, disabled, readOnly }) => {

    return (
        <Form.Item
            label={label}
            tooltip={{
                title: title ? title : label,
                icon: <InfoCircleOutlined />,
            }}
            name={name}
            rules={[
                {
                    required: required,
                    message: message ? message : label,
                },
            ]}
        >
            {
                type === 'number' ?
                    <InputNumberField placeholder={placeholder ? placeholder : label} />
                    :
                    <Input placeholder={placeholder ? placeholder : label} disabled={disabled} readOnly={readOnly} />

            }
        </Form.Item>
    );
}

export default InputPlain;