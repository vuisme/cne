import React from 'react'
import {useCartMutation} from '../../../../../../api/CartApi';
import Swal from "sweetalert2";
import {getObjectPropertyValue} from "../../../../../../utils/CartHelpers";

const ManageQuantity = (props) => {
  const {cart, configItem, cartConfiguredItem, Quantity, product} = props;

  const {updateCart: {isLoading, mutateAsync}} = useCartMutation();

  const MasterQuantity = product?.MasterQuantity ? product?.MasterQuantity : 0;
  let cartItemQty = configItem?.quantity;
  let qty = cartConfiguredItem?.qty ? parseInt(cartConfiguredItem?.qty) : parseInt(cartItemQty);
  let maxQuantity = cartConfiguredItem?.maxQuantity;


  const updateCustomerCartQuantity = (newQty) => {
    let Max = maxQuantity ? parseInt(maxQuantity) : parseInt(MasterQuantity);
    let proceed = true;
    if (parseInt(newQty) < 0) {
      proceed = false;
      Swal.fire({
        text: 'You can not down the minimum quantity',
        icon: 'info'
      });
    }
    if (parseInt(newQty) > Max) {
      proceed = false;
      Swal.fire({
        text: 'Maximum quantity already selected',
        icon: 'info'
      });
    }
    if (proceed) {
      const updateData = {
        cart_id: getObjectPropertyValue(cart, 'id'),
        item_id: getObjectPropertyValue(configItem, 'id'),
        variation_id: getObjectPropertyValue(cartConfiguredItem, 'id'),
        qty: parseInt(newQty),
      };
      mutateAsync(updateData);
    }
  };

  const incrementDecrement = (qtyType = null) => {
    if (qtyType === 'minus') {
      qty = qty - 1;
    } else {
      qty = qty + 1;
    }
    updateCustomerCartQuantity(qty);
  };

  return (
    <div className="row">
      <div className="col-6 col-md-4">
        <div className="input-group express_qty_input">
          <div className="input-group-prepend">
            <button type="button"
                    onClick={() => incrementDecrement('minus')}
                    className="btn btn-secondary btn-minus">
              <i className="icon-minus"/>
            </button>
          </div>
          <input type="text" className="form-control qty_input_field" value={qty}
                 onChange={e => updateCustomerCartQuantity(e.target.value)}/>
          <div className="input-group-append">
            <button type="button"
                    onClick={() => incrementDecrement()}
                    className="btn btn-secondary btn-plus"><i className="icon-plus"/></button>
          </div>
        </div>
      </div>
      <div className="col">
        <p className="m-0 py-2">{Quantity ? Quantity : MasterQuantity} pieces available</p>
      </div>
    </div>
  )
}

export default ManageQuantity