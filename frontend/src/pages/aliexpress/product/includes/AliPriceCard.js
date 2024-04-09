import React, { useEffect, useState } from "react";
import {
  aliActiveConfigurations,
  aliConversionSlubRate,
  aliProductConvertionPrice,
} from "../../../../utils/AliHelpers";

const AliPriceCard = (props) => {
  const { product, operationalAttributes, settings } = props;

  const priceCard = aliActiveConfigurations(product, operationalAttributes);
  console.log('priceCard', priceCard);
  const currency = settings?.currency_icon || "৳";
  const aliRate = settings?.ali_increase_rate || 100;
  const conversion = settings?.ali_pricing_conversion || null;

  const skuAmount = priceCard?.price;
  const skuActivityAmount =
    priceCard?.promotion_price < 0.01
      ? skuAmount
      : priceCard?.promotion_price || skuAmount;

  const ali_rate = aliConversionSlubRate(
    conversion,
    skuActivityAmount,
    aliRate
  );

  const discount = () => {
    let percent = 0;
    if (skuAmount > skuActivityAmount) {
      percent = 100 - (skuActivityAmount / skuAmount) * 100;
    }
    return parseInt(percent);
  };

  const formatedDiscountedPrice = () => {
    let amount = 0;
    if (skuActivityAmount) {
      amount = `${currency} ${aliProductConvertionPrice(
        skuActivityAmount,
        ali_rate
      )}`;
    }
    return amount;
  };

  const formatedRegularMaxPrice = () => {
    let amount = 0;
    if (skuAmount) {
      amount = `${currency} ${aliProductConvertionPrice(skuAmount, ali_rate)}`;
    }
    return amount;
  };

  return (
    <div className="card mb-3 pricing_card">
      <div className="card-body">
        <div>
          <span className="show_price">{formatedDiscountedPrice()}</span>
          {discount() > 0 && (
            <del className="ml-3 delete_price">{formatedRegularMaxPrice()}</del>
          )}
        </div>
        {discount() > 0 && (
          <div className="discount_box">{Math.round(discount())}% Discount</div>
        )}
      </div>
    </div>
  );
};

export default AliPriceCard;
