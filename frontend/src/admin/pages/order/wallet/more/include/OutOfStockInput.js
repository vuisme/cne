import { Radio, Form } from 'antd';
import InputPlain from '../../../../../../components/input/InputPlain';
import { cancelMissingAmt } from './walletHelpers';


const OutOfStockInput = ({ walletItem, form }) => {
  const { out_of_stock } = walletItem;

  form.setFieldsValue({ out_of_stock });

  const setOptionAction = (e) => {
    let option = e.target.value;
    if (option === 'partial') {
      form.setFieldsValue({
        out_of_stock_type: option,
        out_of_stock
      });
    } else if (option === 'full') {
      form.setFieldsValue({
        out_of_stock_type: option,
        out_of_stock: cancelMissingAmt(walletItem),
      });
    }
  }

  return (
    <>
      <Form.Item name="out_of_stock_type">
        <Radio.Group defaultValue="partial" buttonStyle="solid" onChange={e => setOptionAction(e)}>
          <Radio.Button value="partial">Partial</Radio.Button>
          <Radio.Button value="full">Full Out of Stock</Radio.Button>
        </Radio.Group>
      </Form.Item>

      <InputPlain
        type="number"
        label="Out of stock"
        title="Out of stock"
        name="out_of_stock"
        required={true}
        message="Input Out of stock"
        placeholder="Out of stock"
      />

    </>
  );
};

export default OutOfStockInput;