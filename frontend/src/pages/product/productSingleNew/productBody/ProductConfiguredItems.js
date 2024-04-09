import React, { useState } from "react";
import ManageQuantity from "./includes/ManageQuantity";
import {
  getProductAttributes,
  getProductPrice,
  is_size
} from "../../../../utils/CartHelpers";
import { getSetting } from "../../../../utils/Helpers";
import { isArray, isEmpty, isObject } from "lodash";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const ProductConfiguredItems = (props) => {
  const {
    product,
    ConfiguredItems,
    colorAttributes,
    cartAttribute,
    general,
  } = props;
  const [isSize, setIsSize] = useState(true);
  const [firstConfig, setFirstConfig] = useState({});

  const Attributes = getProductAttributes(product);
  const rate = getSetting(general, "increase_rate", 15);
  const currency = getSetting(general, "currency_icon");

  const notColoured = (configAttr) => {
    return colorAttributes?.find((colorAttr) => {
      const compare = { Pid: colorAttr.Pid, Vid: colorAttr.Vid };
      return JSON.stringify(compare) === JSON.stringify(configAttr);
    });
  };

  const getConfigAttributes = (Configurators) => {
    const Attribute = Attributes?.find((attribute) => {
      const compare = { Pid: attribute.Pid, Vid: attribute.Vid };
      if (!notColoured(compare) && is_size(attribute?.PropertyName)) {
        return Configurators?.find(
          (find) => JSON.stringify(find) === JSON.stringify(compare)
        );
      }
      return false;
    });
    if (!isEmpty(Attribute)) {
      if (isEmpty(firstConfig)) {
        setFirstConfig(Attribute);
      }
      return Attribute?.Value;
    }
    const lastConfig = isArray(Configurators) ? Configurators[Configurators.length - 1] : {};
    const newAttribute = Attributes?.find((attribute) => JSON.stringify({
      Pid: attribute.Pid,
      Vid: attribute.Vid
    }) === JSON.stringify(lastConfig));
    if (isEmpty(firstConfig)) {
      setFirstConfig(newAttribute);
    }
    return newAttribute?.Value;
  };

  const activeConfiguredItems = () => {
    let returnValues = [];
    if (!isEmpty(cartAttribute)) {
      returnValues = ConfiguredItems.filter((filter) => {
        let Configurators = filter.Configurators;
        Configurators = Configurators.find(
          (configAttr) =>
            configAttr.Pid === cartAttribute.Pid &&
            configAttr.Vid === cartAttribute.Vid
        );
        return !isEmpty(Configurators);
      });
    }
    return isEmpty(returnValues) ? ConfiguredItems : returnValues;
  };

  const ConfiguredItemAttributes = (config) => {
    let configAttr = [];
    let Configurators = config.Configurators;
    if (isArray(Attributes) && isArray(Configurators)) {
      configAttr = Attributes.filter((filter) => {
        let findConfg = Configurators.find(
          (find) => find.Pid === filter.Pid && find.Vid === filter.Vid
        );
        return !isEmpty(findConfg);
      });
    }
    return configAttr;
  };

  const ProductConfiguredItems = activeConfiguredItems();

  if (ProductConfiguredItems.length <= 0) {
    return (
      <div className="ProductConfiguredItems table-responsive-sm ">
        <h2>{`${currency} ${getProductPrice(product, rate)}`}</h2>
        <ManageQuantity product={product} />
      </div>
    );
  }


  return (
    <div className="ProductConfiguredItems shadow-sm table-responsive-sm">
      <table className="table table-sm text-center table-bordered product_summary_table">
        <thead>
          <tr>
            <th>{firstConfig?.PropertyName}</th>
            <th style={{ width: "90px" }}>Price</th>
            <th style={{ width: "130px" }}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {ProductConfiguredItems.map((config, index) => (
            <tr key={index}>
              <td className="align-middle">
                {getConfigAttributes(config.Configurators)}
              </td>
              <td className="align-middle">{`${currency} ${getProductPrice(
                product,
                rate,
                config
              )}`}</td>
              {Number(config.Quantity) <= 0 ? (
                <td className="text-center align-middle pb-0">
                  Out of Stock
                </td>
              ) : (
                <td className="text-center align-middle pb-0">
                  <ManageQuantity
                    product={product}
                    ConfiguredItem={config}
                    ConfiguredItemAttributes={ConfiguredItemAttributes(
                      config
                    )}
                  />
                  <p className="maxQuantityText">
                    {config.Quantity}
                  </p>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (state) => ({
  cartAttribute: state.CART.Attribute,
  cartConfigured: state.CART.configured,
});

export default connect(mapStateToProps, {})(withRouter(ProductConfiguredItems));
