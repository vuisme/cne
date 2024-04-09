import React, { useEffect, useState } from "react";
import Sticky from "react-sticky-el";
import AliMediaPart from "./media/AliMediaPart";
import AliAttributes from "./attributes/AliAttributes";
import AliPriceCard from "./AliPriceCard";
import AliQuantityInput from "./quantity/AliQuantityInput";
import { useCart } from "../../../../api/CartApi";
import AliShipmentInfo from "./shipping/AliShipmentInfo";
import AliAddToCart from "./addToCart/AliAddToCart";
import AliProductSummary from "./summary/AliProductSummary";
import AliSellerInfo from "./sellerInfo/AliSellerInfo";
import AliSocialShare from "./AliSocialShare";

const AliProductBody = (props) => {
  const { isMobile, product, settings } = props;
  const [operationalAttributes, setOperationalAttributes] = useState({});
  const [activeImg, setActiveImg] = useState("");
  const [activeShipping, setActiveShipping] = useState();
  const [selectShipping, setSelectShipping] = useState("");

  const productItem = product?.item || {};
  const productId = productItem?.num_iid;

  const { data: cart } = useCart();
  const cartItem =
    cart?.cart_items?.find(
      (item) => String(item.ItemId) === String(productId)
    ) || {};

  const product_title = productItem?.title;

  const imagePathList = productItem?.images || [];

  useEffect(() => {
    const mainImg = imagePathList?.length > 0 ? imagePathList[0] : "";
    const { thumbnail } = product?.item?.video || {};
    if (thumbnail) {
      setActiveImg(thumbnail);
    } else if (mainImg) {
      setActiveImg(mainImg);
    }
  }, [imagePathList, product]);

  const skuProperties = product?.item?.skus?.props || [];
  const hasShipFromChina = product?.delivery?.freightList?.find(
    (freight) => freight.fromCode === "CN"
  );
  const hasBDShipment = product?.delivery?.freightList?.find(
    (freight) => freight.toCode === "BD"
  );

  return (
    <div className="product-details-top">
      {!isMobile && <h1 className="single-product-title">{product_title}</h1>}
      <div className="row">
        <div className="col-md-5">
          {!isMobile ? (
            <Sticky
              boundaryElement=".product-details-top"
              hideOnBoundaryHit={false}
            >
              <AliMediaPart
                product={product}
                imagePathList={imagePathList}
                activeImg={activeImg}
                setActiveImg={setActiveImg}
              />
            </Sticky>
          ) : (
            <AliMediaPart
              product={product}
              imagePathList={imagePathList}
              activeImg={activeImg}
              setActiveImg={setActiveImg}
            />
          )}
        </div>
        {/* End .col-md-6 */}
        <div className="col-md-7">
          {isMobile && (
            <h1 className="single-product-title">{product_title}</h1>
          )}
          <AliPriceCard
            product={product}
            operationalAttributes={operationalAttributes}
            settings={settings}
          />
          <p className="mb-2">
            <b>{productItem?.wish_count}</b> Loved | <b>{productItem?.sales}</b>{" "}
            Orders
          </p>

          <div className="product-details">
            {skuProperties?.length > 0 && (
              <AliAttributes
                cartItem={cartItem}
                operationalAttributes={operationalAttributes}
                setOperationalAttributes={setOperationalAttributes}
                skuProperties={skuProperties}
                setActiveImg={setActiveImg}
              />
            )}
            {hasShipFromChina || hasBDShipment ? (
              <div className="shipment">
                <AliShipmentInfo
                  cartItem={cartItem}
                  product={product}
                  activeShipping={activeShipping}
                  setActiveShipping={setActiveShipping}
                  selectShipping={selectShipping}
                  setSelectShipping={setSelectShipping}
                  settings={settings}
                />

                <AliQuantityInput
                  cartItem={cartItem}
                  product={product}
                  settings={settings}
                  activeShipping={activeShipping}
                  selectShipping={selectShipping}
                  setSelectShipping={setSelectShipping}
                  operationalAttributes={operationalAttributes}
                />

                <AliProductSummary
                  cartItem={cartItem}
                  product={product}
                  selectShipping={selectShipping}
                  settings={settings}
                  operationalAttributes={operationalAttributes}
                />

                <AliAddToCart
                  cartItem={cartItem}
                  product={product}
                  settings={settings}
                />
              </div>
            ) : (
              <h3 className="text-danger my-3">
                "This product not possible to Ship Bangladesh"
              </h3>
            )}

            <AliSellerInfo product={product} />

            <AliSocialShare product={product} settings={settings} />
          </div>
          {/* End .product-details */}
        </div>
        {/* End .col-md-6 */}
      </div>
    </div>
  );
};

export default AliProductBody;
