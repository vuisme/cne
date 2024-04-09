import {
  aliProductConvertionPrice,
  sumCartItemTotal,
} from "../../../../../utils/AliHelpers";
import { useEffect, useState } from "react";
import { useChooseShipping } from "../../../../../api/AliExpressProductApi";
import Swal from "sweetalert2";
import { useQueryClient } from "react-query";
import ShippingModal from "./includes/ShippingModal";

const AliShipmentInfo = (props) => {
  const {
    cartItem,
    product,
    settings,
    activeShipping,
    setActiveShipping,
    selectShipping,
    setSelectShipping,
  } = props;
  const [optionEnable, setOptionEnable] = useState(false);

  const cache = useQueryClient();
  const { mutateAsync, isLoading } = useChooseShipping();

  const itemTotal = sumCartItemTotal(cartItem?.variations || []);
  const currency = settings?.currency_icon || "৳";
  const item_id = product?.item?.num_iid;
  const completeFreightList = product?.delivery?.freightList || [];
  const freightList = completeFreightList;

  let aliRate = settings?.ali_increase_rate || 0;
  aliRate = aliRate ? parseInt(aliRate) : 90;
  let minOrder = settings?.express_shipping_min_value || 0;
  minOrder = minOrder ? parseInt(minOrder) : 300;

  const isExpressEnable = itemTotal >= minOrder;

  useEffect(() => {
    if (!selectShipping && freightList?.length > 0) {
      setSelectShipping(freightList?.[0]);
    }
  }, [freightList, selectShipping]);

  useEffect(() => {
    if (!selectShipping && freightList?.length > 0) {
      setSelectShipping(freightList?.[0]);
    }
    if (cartItem?.shipping_type) {
      setActiveShipping(cartItem?.shipping_type);
    }
  }, [freightList, setSelectShipping, cartItem]);

  const shippingRate = (amount) => {
    if (!amount) {
      return 0;
    }
    return aliProductConvertionPrice(amount, aliRate);
  };

  const updateShippingInformation = (updateData) => {
    mutateAsync(
      { item_id, ...updateData },
      {
        onSuccess: () => {
          cache.invalidateQueries("customer_cart");
        },
      }
    );
  };

  useEffect(() => {
    if (!isExpressEnable) {
      const delivery_fee = selectShipping?.delivery_fee;
      let nextProcess = true;
      if (delivery_fee !== undefined) {
        const shipping_cost = shippingRate(delivery_fee);
        if (shipping_cost >= 0) {
          console.log("has shipping const");
          setActiveShipping("regular");
          updateShippingInformation({
            shipping_cost,
            shipping_type: "regular",
          });
          nextProcess = false;
        }
      }
      if (nextProcess && !freightList?.length) {
        console.log("has no shipping const");
        setActiveShipping();
        updateShippingInformation({ shipping_cost: 0, shipping_type: null });
      }
    }
  }, [isExpressEnable, selectShipping]);

  const selectShippingMethod = (event) => {
    const value = event.target.value;
    if (value === "regular") {
      setActiveShipping(value);
      const shipping_cost = shippingRate(selectShipping?.delivery_fee || 0);
      updateShippingInformation({ shipping_cost, shipping_type: value });
    } else if (value === "express") {
      if (isExpressEnable) {
        setActiveShipping(value);
        updateShippingInformation({ shipping_type: value });
      } else {
        Swal.fire({
          text: `For Express shipping min product value ${currency} ${minOrder}`,
          icon: "warning",
          confirmButtonText: "Ok, Dismiss",
        });
        setActiveShipping("regular");
      }
    } else {
      setActiveShipping(null);
    }
    return "";
  };

  const toggleChoseOption = (event, option = true) => {
    event.preventDefault();
    setOptionEnable(option);
  };

  const updateDeliveryCharge = (shipping) => {
    setSelectShipping(shipping);
    const shipping_cost = shippingRate(shipping?.delivery_fee || 0);
    updateShippingInformation({ shipping_cost, shipping_type: activeShipping });
  };

  return (
    <div className="mb-3">
      <div className="mb-2">
        {freightList?.length > 0 && (
          <div className="form-check form-check-inline">
            <input
              className="form-check-input"
              type="radio"
              onChange={(event) => selectShippingMethod(event)}
              checked={activeShipping === "regular"}
              name="shipping"
              id="regular"
              value="regular"
            />
            <label className="form-check-label" htmlFor="regular">
              Regular Shipping
            </label>
          </div>
        )}
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="radio"
            onChange={(event) => selectShippingMethod(event)}
            checked={activeShipping === "express"}
            name="shipping"
            id="express"
            value="express"
          />
          <label
            className={`form-check-label ${
              isExpressEnable && "font-weight-bold"
            }`}
            htmlFor="express"
          >
            Express Shipping (15-25 Days){" "}
          </label>
        </div>
      </div>
      {activeShipping === "regular" && freightList?.length > 0 && (
        <div>
          {optionEnable && (
            <ShippingModal
              currency={currency}
              freightList={freightList}
              shippingRate={shippingRate}
              selectShipping={selectShipping}
              updateDeliveryCharge={updateDeliveryCharge}
              setOptionEnable={setOptionEnable}
            />
          )}

          <div className="list-group-item list-group-item-action p-2 rounded">
            <h5 className="mb-1">{`${selectShipping.delivery_company}`}</h5>
            <div className="d-flex w-100 justify-content-between">
              <div>
                <p className="mb-1">
                  Shipping Rate:{" "}
                  {`${currency} ` + shippingRate(selectShipping?.delivery_fee)}
                </p>
                <small>{`Estimated duration: ${selectShipping?.delivery_time} Days`}</small>
              </div>
              <div>
                <a
                  href="/more"
                  onClick={(event) => toggleChoseOption(event)}
                  className="small"
                >
                  More Option <i className="icon-down-open" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AliShipmentInfo;
