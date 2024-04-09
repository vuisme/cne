import { Input, Tooltip } from "antd";
import React from "react";

const formatNumber = (value) => new Intl.NumberFormat().format(value);

const InputNumberField = (props) => {
  const { value, onChange, placeholder } = props;

  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;

    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  }; // '.' at the end or only '-' in the input box.

  const handleBlur = () => {
    let valueTemp = value;
    if (value.toString().charAt(value.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    if (valueTemp) {
      onChange(valueTemp.replace(/0*(\d+)/, '$1'));
    }
  };

  const title = value ? (
    <span className="numeric-input-title">
      {value !== '-' ? formatNumber(Number(value)) : '-'}
    </span>) : ('Input a number');
  return (
    <Tooltip trigger={['focus']} title={title} placement="topLeft" overlayClassName="numeric-input">
      <Input
        {...props}
        onChange={handleChange}
        onBlur={handleBlur}
        placeholder={placeholder}
        maxLength={25}
      />
    </Tooltip>
  );
};


export default InputNumberField;