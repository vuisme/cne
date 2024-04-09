import _, { isEmpty, isObject } from "lodash";
import { sumCartItemTotal, sumCartItemTotalQuantity } from "./AliHelpers";

export const getProductKeyItem = (product, keyName, returnDefault = null) => {
  if (!_.isEmpty(product) && _.isObject(product)) {
    return product[keyName];
  }
  return returnDefault;
};

export const collectSelectedAttributes = (cartAttribute) => {
  const collectAttributes = [];
  for (const groupKey in cartAttribute) {
    const attrItem = cartAttribute?.[groupKey];
    if (attrItem) {
      collectAttributes.push(attrItem);
    }
  }
  return collectAttributes;
};

// const stringifyAttributes = (Attributes) => {
//   let collect = [];
//   Attributes?.map((item) => {
//     collect.push(item.Pid + "_" + item.Vid);
//     return false;
//   });
//   return collect;
// };

export const getActiveConfiguredItems = (ConfiguredItems, cartAttribute) => {
  const CartAttributes = collectSelectedAttributes(cartAttribute);
  // const compare1 = stringifyAttributes(CartAttributes);
  let configItems = [];
  for (let i = 0; i < ConfiguredItems.length; i++) {
    const ConfiguredItem = ConfiguredItems[i];
    const Configurators = ConfiguredItem?.Configurators || [];
    const newConfig =
      Configurators?.filter((filter) =>
        CartAttributes?.find(
          (findAttr) =>
            findAttr.Pid === filter.Pid && findAttr.Vid === filter.Vid
        )
      ) || [];
    if (newConfig.length === Configurators.length) {
      configItems.push(ConfiguredItem);
      break;
    }
  }
  if (configItems.length === 0) {
    configItems =
      ConfiguredItems?.filter((ConfiguredItem) =>
        ConfiguredItem?.Configurators?.find((find) =>
          CartAttributes?.find(
            (findAttr) => findAttr.Pid === find.Pid && findAttr.Vid === find.Vid
          )
        )
      ) || [];
  }
  return configItems;
};

export const firstAttributeConfiguredItems = (
  ConfiguredItems,
  firstAttribute
) => {
  return ConfiguredItems?.filter((findConfig) =>
    findConfig?.Configurators?.find(
      (find) =>
        find.Pid === firstAttribute.Pid && firstAttribute.Vid === find.Vid
    )
  );
};

export const getObjectPropertyValue = ($object, $property, $default = null) => {
  return $object?.[$property] ? $object?.[$property] : $default;
};

export const calculatePrice = (price, rate) => {
  let cost = Number(price) * Number(rate);
  return Math.round(cost);
};

export const getProductCurrentPrice = (
  $product,
  activeConfigItemPrice,
  rate
) => {
  let OriginalPrice = activeConfigItemPrice
    ? activeConfigItemPrice
    : $product?.Price?.OriginalPrice;
  let Promotions = $product?.Promotions;
  if (Promotions?.length > 0) {
    OriginalPrice = Promotions[0]?.Price?.OriginalPrice;
  }
  return calculatePrice(OriginalPrice, rate);
};

export const getProductWeight = (product) => {
  let Weight = product?.PhysicalParameters?.Weight || 0;
  if (!Weight) {
    Weight = product?.PhysicalParameters?.ApproxWeight || 0;
  }
  if (!Weight) {
    Weight = product?.ActualWeightInfo?.Weight || 0;
  }
  return Weight ? Number(Weight).toFixed(3) : "0.000";
};

export const getProductDeliveryCosts = ($product, rate) => {
  let DeliveryCosts = $product?.DeliveryCosts;
  let charge = "5";
  if (DeliveryCosts?.length > 0) {
    charge = DeliveryCosts[0]?.Price?.OriginalPrice;
  }
  return calculatePrice(charge, rate);
};

export const getProductModifiedConfiguredItem = (
  $product,
  qty,
  activeConfiguredItem,
  rate
) => {
  let configItem = {};
  let configId = activeConfiguredItem?.Id;
  configItem.Id = configId;
  configItem.qty = qty;
  configItem.maxQuantity = activeConfiguredItem?.Quantity;

  let configItemPrice = activeConfiguredItem?.Price?.OriginalPrice;

  let ConfigPrice = 0;
  let ProductPrice = $product?.Price?.OriginalPrice;
  let ProductPromotions = $product?.Promotions;
  if (ProductPromotions?.length > 0) {
    ProductPromotions = ProductPromotions[0];
    ConfigPrice = ProductPromotions?.Price?.OriginalPrice;
    let promoConfiguredItems = ProductPromotions?.ConfiguredItems;
    let findConfig = promoConfiguredItems?.find((find) => find.Id === configId);
    if (findConfig) {
      ConfigPrice = findConfig?.Price?.OriginalPrice;
    }
  } else {
    ConfigPrice = configItemPrice ? configItemPrice : ProductPrice;
  }

  configItem.price = calculatePrice(ConfigPrice, rate);

  let Attributes = $product?.Attributes;
  let Configurators = activeConfiguredItem?.Configurators;
  let selectAttributes = [];
  Configurators?.map((config) => {
    const findAttr = Attributes.find(
      (find) => find.Pid === config.Pid && find.Vid === config.Vid
    );
    if (findAttr) {
      selectAttributes.push(findAttr);
    }
    return '';
  });
  configItem.Attributes = selectAttributes;

  return configItem;
};

export const getProductModifiedWithOutConfiguredItem = ($product, rate) => {
  let configItem = {};
  let configId = $product?.Id;
  configItem.Id = configId;
  configItem.qty = 1;
  configItem.maxQuantity = $product?.MasterQuantity;

  let ConfigPrice = 0;
  let ProductPrice = $product?.Price?.OriginalPrice;
  let ProductPromotions = $product?.Promotions;
  if (ProductPromotions?.length > 0) {
    ProductPromotions = ProductPromotions[0];
    ConfigPrice = ProductPromotions?.Price.OriginalPrice;
    let promoConfiguredItems = ProductPromotions?.ConfiguredItems;
    let findConfig = promoConfiguredItems?.find((find) => find.Id === configId);
    if (findConfig) {
      ConfigPrice = findConfig?.Price.OriginalPrice;
    }
  } else {
    ConfigPrice = ProductPrice;
  }
  configItem.price = calculatePrice(ConfigPrice, rate);
  configItem.Attributes = [];

  return configItem;
};

// ========== bolow is the unknown ===========

export const numberWithCommas = (numericDtaa) => {
  if (numericDtaa) {
    let floatNum = Number(numericDtaa).toFixed(2);
    return floatNum.toString().split(".")[0].length > 3
      ? floatNum
        .toString()
        .substring(0, floatNum.toString().split(".")[0].length - 3)
        .replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      "," +
      floatNum
        .toString()
        .substring(floatNum.toString().split(".")[0].length - 3)
      : floatNum.toString();
  }
  return "0.00";
};

export const findOldConfiguredExpectCurrent = (findItem, selectedConfig) => {
  if (_.isObject(selectedConfig) && _.isObject(findItem)) {
    if (!_.isEmpty(selectedConfig) && !_.isEmpty(findItem)) {
      return findItem.ConfiguredItems.filter(
        (filter) => filter.Id !== selectedConfig.Id
      );
    }
  }
  return [];
};

export const findOldCartItemExpectCurrent = (oldConfigured, productId) => {
  if (!_.isArray(oldConfigured) && !_.isEmpty(oldConfigured)) {
    return oldConfigured.filter((filter) => filter.Id !== productId);
  }
  return [];
};

export const getProductAttributes = (product) => {
  return product?.Attributes || [];
};

export const getProductGroupedAttributes = (Attributes) => {


  const result = Attributes.reduce(function (r, a) {
    r[a.PropertyName] = r[a.PropertyName] || [];
    r[a.PropertyName].push(a);
    return r;
  }, Object.create(null));


  const returnGroup = [];
  for (const attr in result) {
    let item = result[attr]?.find(find => find.MiniImageUrl !== undefined);
    if (item) {
      returnGroup.unshift({
        key: attr,
        values: result[attr],
      });
    } else {
      returnGroup.push({
        key: attr,
        values: result[attr],
      });
    }
  }

  return returnGroup;

};

export const GetOriginalPriceFromPrice = (Price, rate) => {
  let sellPrice = 0;
  if (!_.isEmpty(Price)) {
    if (_.isObject(Price)) {
      sellPrice = Number(Price.OriginalPrice) * Number(rate);
    }
    if (_.isArray(Price)) {
      sellPrice = Number(Price[0].OriginalPrice) * Number(rate);
    }
  }
  return _.round(sellPrice);
};

/**
 *
 * @param product
 * @param rate
 * @param ConfiguredItem
 * @returns {number|*}
 */
export const getProductPrice = (product, rate = 15, ConfiguredItem = {}) => {
  let sellPrice = 0;
  if (!_.isEmpty(product)) {
    let Price = product.Price;
    let configuredId = null;
    if (!_.isEmpty(ConfiguredItem)) {
      Price = ConfiguredItem.Price;
      configuredId = ConfiguredItem.Id;
    }
    const Promotions = product.Promotions;
    if (!_.isEmpty(Promotions) && _.isArray(Promotions)) {
      Price = Promotions.map((promotion) => {
        const promoConfig = promotion.ConfiguredItems;
        const promoPrice = promotion.Price;
        if (_.isArray(promoConfig)) {
          const findPromoConfig = promotion.ConfiguredItems.find(
            (configFilter) => configFilter.Id === configuredId
          );
          return !_.isEmpty(findPromoConfig)
            ? findPromoConfig.Price
            : promoPrice;
        }
        return promoPrice;
      });
    }

    if (!_.isEmpty(Price)) {
      return GetOriginalPriceFromPrice(Price, rate);
    }
  }
  return sellPrice;
};

export const getDBProductPrice = (product, rate = 15, selectedConfig = {}) => {
  let sellPrice = product?.sale_price || 0;
  if (product?.Price) {
    let Price = JSON.parse(product.Price);
    if (Price?.OriginalPrice) {
      sellPrice = Number(Price.OriginalPrice) * Number(rate);
    }
    if (Price?.length > 0) {
      sellPrice = Price[0]?.OriginalPrice
        ? Number(Price[0]?.OriginalPrice) * Number(rate)
        : sellPrice;
    }
    return Math.round(sellPrice);
  }
  return sellPrice;
};

export const getDBAliProductPrice = (product, rate = 100) => {
  let Price = product?.Price ? JSON.parse(product?.Price) : {};
  let sellPrice = 0;
  if (Price?.min_promo_price > 0) {
    sellPrice = Number(Price.min_promo_price) * Number(rate);
  } else if (Price?.min_price > 0) {
    sellPrice = Number(Price.min_price) * Number(rate);
  } else if (product?.sale_price > 0) {
    sellPrice = Number(product.sale_price);
  } else if (product?.regular_price > 0) {
    sellPrice = Number(product.regular_price);
  }
  return Math.round(sellPrice);
};

/**
 *
 * @param words
 * @returns {boolean}
 */
export const is_colour = (words) => {
  if (words.indexOf("colour") >= 0) {
    return true;
  }
  if (words.indexOf("Colour") >= 0) {
    return true;
  }
  if (words.indexOf("color") >= 0) {
    return true;
  }
  return words.indexOf("Color") >= 0;
};

export const is_size = (words) => {
  if (words.indexOf("Size") >= 0) {
    return true;
  }
  if (words.indexOf("size") >= 0) {
    return true;
  }
  return false;
};

export const getSizeAttributes = (Attributes) => {
  if (!_.isEmpty(Attributes)) {
    return Attributes.filter((filter) => {
      if (filter.IsConfigurator === true) {
        return is_size(filter.PropertyName);
      }
      return false;
    });
  }
  return [];
};

/**
 *
 * @param Product
 * @returns {*[]|*}
 */
export const ConfiguratorAttributes = (Attributes) => {
  const filter = Attributes?.filter((filter) => filter.IsConfigurator === true);
  return filter ? filter : [];
};

/**
 *
 * @param product
 * @param common
 * @returns {number|*}
 */
export const getProductApproxWeight = (product, common = 0) => {
  if (_.isObject(product)) {
    const PhysicalParameters = product.PhysicalParameters;
    if (!_.isEmpty(PhysicalParameters) && _.isObject(PhysicalParameters)) {
      const ManualWeight = PhysicalParameters.ManualWeight;
      if (ManualWeight) {
        return ManualWeight ? ManualWeight : common;
      }
      const weight = PhysicalParameters.ApproxWeight;
      return weight ? weight : common;
    }
  }
  return common;
};

export const getProductDeliveryCost = (product, rate = 15) => {
  let shipping = 0;
  if (!_.isEmpty(product) && _.isObject(product)) {
    // const HasInternalDelivery = product.HasInternalDelivery;
    const DeliveryCosts = product.DeliveryCosts;
    if (_.isArray(DeliveryCosts)) {
      const DeliveryCost = DeliveryCosts.length > 0 ? DeliveryCosts[0] : {};
      if (!_.isEmpty(DeliveryCost)) {
        const Price = DeliveryCost.Price;
        const OriginalPrice = !_.isEmpty(Price) ? Price.OriginalPrice : 0;
        shipping = (Number(OriginalPrice) * Number(rate)).toFixed(2);
      }
    }
  }
  return shipping;
};

export const getProductFeaturedValues = (product, keyName, common = 0) => {
  if (!_.isEmpty(product) && _.isObject(product)) {
    const FeaturedValues = product.FeaturedValues;
    if (!_.isEmpty(FeaturedValues) && _.isArray(FeaturedValues)) {
      const FeatureItem = FeaturedValues.find((find) => find.Name === keyName);
      return !_.isEmpty(FeatureItem) && _.isObject(FeatureItem)
        ? FeatureItem.Value
        : common;
    }
  }
  return common;
};

export const matchAttributesConfigurator = (
  selectAttributes = [],
  ConfiguredItems = []
) => {
  const remakeAttributes = selectAttributes.map((item) => {
    return { Pid: item.Pid, Vid: item.Vid };
  });
  return ConfiguredItems.filter((filter) => {
    const difference = _.differenceWith(
      remakeAttributes,
      filter.Configurators,
      _.isEqual
    );
    return _.isEmpty(difference);
  });
};

export const getCartConfiguredItems = (cartConfigured, productId) => {
  if (!_.isEmpty(cartConfigured) && _.isArray(cartConfigured)) {
    const findItem = cartConfigured.find((find) => find.Id === productId);
    if (!_.isEmpty(findItem) && _.isObject(findItem)) {
      const ConfiguredItems = findItem.ConfiguredItems;
      return !_.isEmpty(ConfiguredItems) && _.isArray(ConfiguredItems)
        ? ConfiguredItems
        : [];
    }
  }
  return [];
};

export const getCartSelectedConfig = (ConfiguredItems) => {
  if (!_.isEmpty(ConfiguredItems) && _.isArray(ConfiguredItems)) {
    const returnKey = ConfiguredItems.length === 1 ? ConfiguredItems[0] : {};
    return !_.isEmpty(returnKey) && _.isObject(returnKey) ? returnKey : {};
  }
  return {};
};

export const activeProductAllConfigurators = (activeCartProduct) => {
  if (isObject(activeCartProduct)) {
    return !isEmpty(activeCartProduct) ? activeCartProduct.ConfiguredItems : [];
  }
  return [];
};

export const checkExistConfiguredItem = (
  activeCartProduct,
  product_id,
  selectConfigId
) => {
  const activeConfiguredItems =
    activeProductAllConfigurators(activeCartProduct);
  const activeFind = activeConfiguredItems.find(
    (find) => find.Id === selectConfigId
  );
  return !_.isEmpty(activeFind) ? activeFind : {};
};

export const calculateAirShippingCharge = (subTotal, shipping_charges) => {
  let charges = shipping_charges ? JSON.parse(shipping_charges) : [];
  let chargeAmount = 0;
  for (let i = 0; i < charges.length; i++) {
    const dCharge = charges[i];
    if (subTotal === 0) {
      chargeAmount = dCharge.rate;
      break;
    } else if (dCharge.minimum <= subTotal && dCharge.maximum >= subTotal) {
      chargeAmount = dCharge.rate;
      break;
    }
  }
  return parseInt(chargeAmount);
};

// Customer cart calculation functions

export const cartProductTotal = (Product, ShippingCharges) => {
  let ConfiguredItems = Product.ConfiguredItems;
  let ApproxWeight = Product.ApproxWeight;
  let totalPrice = 0;
  let totalQty = 0;
  if (!_.isEmpty(ConfiguredItems)) {
    ConfiguredItems.map((summary) => {
      let Qty = Number(summary.Quantity);
      let Price = Number(summary.Price);
      totalQty += Qty;
      totalPrice += Price * Qty;
      return "";
    });
  }

  let ShippingRate = calculateAirShippingCharge(totalPrice, ShippingCharges);

  return {
    totalPrice: totalPrice,
    totalQty: totalQty,
    ShippingRate: ShippingRate,
    ApproxWeight: ApproxWeight,
    totalWeight: (Number(ApproxWeight) * Number(totalQty)).toFixed(3),
  };
};

export const cartColorAttributes = (attributes, product) => {
  if (_.isArray(attributes)) {
    return attributes.filter((filter) => filter.MiniImageUrl !== undefined);
  }
  return product.MainPictureUrl;
};

export const CartSizeAttributes = (attributes) => {
  if (_.isArray(attributes)) {
    return attributes.filter((filter) => filter.MiniImageUrl === undefined);
  }
  return [];
};

export const CartChinaShippingCost = (Product, ShippingCharges) => {
  let productTotal = cartProductTotal(Product);
  let DeliveryCost = Product.DeliveryCost ? Product.DeliveryCost : 0;
  let totalWeight = productTotal.totalWeight;
  let calculateCharge = calculateAirShippingCharge(
    productTotal.totalPrice,
    ShippingCharges
  );
  let totalCost =
    Number(DeliveryCost) + Number(totalWeight) * Number(calculateCharge);
  return Number(totalCost).toFixed(2);
};

export const CartProductSubTotal = (Product, ShippingCharges) => {
  let productTotal = cartProductTotal(Product);
  let Subtotal = 0;
  if (!_.isEmpty(productTotal)) {
    let otherCost = CartChinaShippingCost(Product, ShippingCharges);
    Subtotal = Number(productTotal.totalPrice) + Number(otherCost);
  }
  return numberWithCommas(Subtotal);
};

export const calculate_advanced_rate = (
  cart_total,
  rates,
  current_rate = 0
) => {
  const settingRates = rates ? JSON.parse(rates) : [];
  if (settingRates?.length > 0) {
    let adv = null;
    for (let i = 0; i < settingRates?.length; i++) {
      const rate_row = settingRates[i];
      const minimum = rate_row?.minimum || 0;
      const maximum = rate_row?.maximum || 0;
      const rate = rate_row?.rate || 0;
      if (cart_total >= minimum && cart_total <= maximum) {
        adv = Number(rate);
        break;
      }
    }
    if (adv) {
      return adv;
    }
  }
  return current_rate;
};

export const CartProductSummary = (cart, advanced_rates, current_rate) => {
  let totalPrice = 0;
  let shipping = 0;
  let totalQty = 0;
  let advanced = 0;
  let dueAmount = 0;
  cart?.cart_items?.map((product) => {
    let DeliveryCost = product?.DeliveryCost || 0;
    const checkedVariations =
      product?.variations?.filter(
        (filter) => parseInt(filter.is_checked) === 1
      ) || [];
    let variationPrice = sumCartItemTotal(checkedVariations);
    let variationQty = sumCartItemTotalQuantity(checkedVariations);
    if (variationPrice > 0) {
      totalQty += variationQty;
      totalPrice += variationPrice;
      shipping += Number(DeliveryCost);
    }
  });
  if (totalPrice > 0) {
    totalPrice = Math.round(totalPrice + shipping);
    let actual_adv_rate = calculate_advanced_rate(
      totalPrice,
      advanced_rates,
      current_rate
    );

    advanced = Math.round((totalPrice * actual_adv_rate) / 100);
    dueAmount = Math.round(totalPrice - advanced);
  }
  return { totalPrice, advanced, dueAmount, totalQty };
};

export const singleProductTotal = (product) => {
  let DeliveryCost = product?.DeliveryCost || 0;
  let variations =
    product?.variations?.filter(
      (variation) => parseInt(variation.is_checked) === 1
    ) || [];
  let variationPrice = sumCartItemTotal(variations);
  if (variationPrice > 0) {
    return Math.round(
      variationPrice + (parseInt(DeliveryCost) > 0 ? parseInt(DeliveryCost) : 0)
    );
  }
  return 0;
};

export const orderSummaryCalculation = (order_items) => {
  let productValue = 0;
  let firstPayment = 0;
  let dueAmount = 0;
  order_items?.map((item) => {
    let price = Number(item.product_value) + Number(item.DeliveryCost);
    let firstPrice = parseInt(item.first_payment);
    productValue += price;
    firstPayment += firstPrice;
    dueAmount += price - firstPrice;
  });
  return { productValue, firstPayment, dueAmount };
};

export const taobaoProductPrepareForLove = (product, rate) => {
  const FeaturedValues = product?.FeaturedValues;
  const TotalSales = FeaturedValues?.find(
    (find) => find.Name === "TotalSales"
  )?.Value;
  const averageStar = FeaturedValues?.find(
    (find) => find.Name === "favCount"
  )?.Value;
  const promoPrice = product?.Promotions?.[0].Price || {};
  const regularPrice = product?.Price;
  const sale_price = parseInt(promoPrice?.OriginalPrice) || 0;
  const regular_price = parseInt(regularPrice?.OriginalPrice) || 0;
  return {
    name: product?.Title,
    ItemId: product?.Id || product?.ItemId,
    provider_type: "Taobao",
    img: product?.MainPictureUrl,
    rating: averageStar,
    sale_price: sale_price
      ? sale_price * parseInt(rate)
      : regular_price * parseInt(rate),
    regular_price: regular_price * parseInt(rate),
    stock: product?.MasterQuantity,
    total_sold: TotalSales,
  };
};

export const taobaoCardProductPrepareForLove = (product, rate) => {
  const FeaturedValues = product?.FeaturedValues;
  const Price = JSON.parse(product?.Price);
  const sale_price = parseInt(Price?.OriginalPrice) || 0;
  const regular_price = parseInt(Price?.MarginPrice) || 0;
  return {
    name: product?.Title,
    ItemId: product?.ItemId,
    provider_type: "Taobao",
    img: product?.MainPictureUrl,
    rating: null,
    sale_price: sale_price
      ? sale_price * parseInt(rate)
      : regular_price * parseInt(rate),
    regular_price: regular_price * parseInt(rate),
    stock: product?.MasterQuantity,
    total_sold: null,
  };
};
