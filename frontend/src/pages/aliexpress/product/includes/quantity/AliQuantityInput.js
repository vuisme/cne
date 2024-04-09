import React from "react";
import { useAddToCart, useCartMutation } from "../../../../../api/CartApi";
import AliManageQuantity from "./includes/AliManageQuantity";
import Swal from "sweetalert2";
import {
  aliActiveConfigurations,
  aliConversionSlubRate,
  aliProductConfiguration,
  aliProductConvertionPrice,
  aliProductPriceCardToPrice,
  aliProductProcessToCart,
} from "../../../../../utils/AliHelpers";
import AliAddToCartButton from "./includes/AliAddToCartButton";
import { useQueryClient } from "react-query";

const AliQuantityInput = (props) => {
  const {
    cartItem,
    product,
    settings,
    activeShipping,
    selectShipping,
    setSelectShipping,
    operationalAttributes,
  } = props;

  const priceCard = aliActiveConfigurations(product, operationalAttributes);
  const actual_price = aliProductPriceCardToPrice(priceCard);
  const cache = useQueryClient();
  const { mutateAsync, isLoading } = useAddToCart();

  const aliRate = settings?.ali_increase_rate || 95;
  const conversion = settings?.ali_pricing_conversion || null;
  const weight = product?.delivery?.packageDetail?.weight || 0;

  const actual_rate = aliConversionSlubRate(conversion, actual_price, aliRate);

  const DeliveryCost = () => {
    let amount = selectShipping?.delivery_fee || 0;
    if (!amount && activeShipping == "regular") {
      const freightList = product?.delivery?.freightList?.[0] || {};
      setSelectShipping(freightList);
      amount = freightList?.delivery_fee || 0;
    }
    return aliProductConvertionPrice(amount, actual_rate);
  };

  const processProductData = () => {
    const converted_price = Number(actual_price) * Number(actual_rate);
    const processProduct = aliProductProcessToCart(
      product,
      Math.round(converted_price)
    );
    console.log("converted_price_rate:", actual_rate);
    processProduct.weight = Number(weight).toFixed(3);
    processProduct.DeliveryCost = DeliveryCost();
    processProduct.Quantity = 1;
    processProduct.shipping_type = activeShipping;
    processProduct.hasConfigurators = true;
    processProduct.ConfiguredItems = aliProductConfiguration(
      product,
      priceCard,
      operationalAttributes,
      converted_price
    );
    return processProduct;
  };

  const Quantity = priceCard?.stock || 0;

  const addToCartProcess = (e) => {
    e.preventDefault();
    const processProduct = processProductData();
    let process = false;
    if (processProduct?.ConfiguredItems?.Id) {
      if (Quantity > 0) {
        process = true;
      } else {
        Swal.fire({
          text: "This variations stock is not available",
          icon: "info",
        });
      }
    }
    if (process) {
      mutateAsync(
        { product: processProduct },
        {
          onSuccess: (cart) => {
            cache.setQueryData("customer_cart", cart);
          },
        }
      );
    }
  };

  const activeConfigId = priceCard?.skuPropIds || product?.item?.num_iid;
  const cartConfiguredItem = cartItem?.variations?.find(
    (find) => String(find.configId) === String(activeConfigId)
  );

  if (!cartItem || !cartConfiguredItem?.qty) {
    return (
      <AliAddToCartButton
        addToCartProcess={addToCartProcess}
        isLoading={isLoading}
        Quantity={Quantity}
      />
    );
  }

  return (
    <AliManageQuantity
      cartItem={cartItem}
      cartConfiguredItem={cartConfiguredItem}
      Quantity={Quantity}
      product={product}
    />
  );
};

export default AliQuantityInput;
