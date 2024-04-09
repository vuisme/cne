import React, { useState } from "react";
import Sticky from "react-sticky-el";
import LoadAttributes from "./includes/attribute/LoadAttributes";
import ProductSummary from "./includes/ProductSummary";
import MediaPart from "./includes/MediaPart";
import { getActiveConfiguredItems } from "../../../../utils/CartHelpers";
import QuantityInput from "./quantity/QuantityInput";
import SocialShare from "./includes/SocialShare";
import SellerInfo from "./includes/SellerInfo";
import PriceCard from "./includes/PriceCard";
import { useCartMutation } from "../../../../api/CartApi";
import { useMediaQuery } from "react-responsive";
import AddToCartButtons from "./addToCart/AddToCartButtons";
import SellDisAllowed from "../sale-disallow/SellDisAllowed";

const ProductBody = (props) => {
  const { product, settings } = props;
  const [cartStore, setCartStore] = useState({});
  const [activeImg, setActiveImg] = useState("");

  const {
    mainCart: { data: cart },
  } = useCartMutation();

  const product_id = product?.Id ? product.Id : "na";
  const Title = product?.Title ? product.Title : "No Title";
  const cartItem =
    cart?.cart_items?.find((item) => item.ItemId === product_id) || {};

  const ConfiguredItems = product?.ConfiguredItems
    ? product.ConfiguredItems
    : [];
  const selectAttributes = cartStore?.Attributes || [];
  const activeConfiguredItems = getActiveConfiguredItems(
    ConfiguredItems,
    selectAttributes
  );

  const FeaturedValues = product?.FeaturedValues ? product.FeaturedValues : [];
  const SalesInLast30Days = FeaturedValues?.find(
    (find) => find.Name === "SalesInLast30Days"
  )?.Value;
  const favCount = FeaturedValues?.find(
    (find) => find.Name === "favCount"
  )?.Value;
  const reviews = FeaturedValues?.find(
    (find) => find.Name === "reviews"
  )?.Value;
  let IsSellAllowed = product?.IsSellAllowed;
  let Expired = FeaturedValues.includes("Expired");

  const isMobile = useMediaQuery({ query: "(max-width: 991px)" });

  return (
    <div className="product-details-top">
      {!isMobile && <h1 className="single-product-title">{Title}</h1>}
      <div className="row">
        <div className="col-md-5">
          {!isMobile ? (
            <Sticky
              boundaryElement=".product-details-top"
              hideOnBoundaryHit={false}
            >
              <MediaPart
                activeImg={activeImg}
                setActiveImg={setActiveImg}
                product={product}
              />
            </Sticky>
          ) : (
            <MediaPart
              activeImg={activeImg}
              setActiveImg={setActiveImg}
              product={product}
            />
          )}
        </div>
        {/* End .col-md-6 */}
        <div className="col-md-7">
          {isMobile && <h1 className="single-product-title">{Title}</h1>}

          {!IsSellAllowed ? (
            <SellDisAllowed />
          ) : (
            <div>
              <PriceCard
                product={product}
                settings={settings}
                activeConfiguredItems={activeConfiguredItems}
              />
              <p className="mb-0">
                <b>{favCount}</b> Favorite with <b>{reviews}</b> positive
                feedback{" "}
              </p>
              {SalesInLast30Days && (
                <p>
                  Sales In Last 30 Days - <b>{SalesInLast30Days}</b>
                </p>
              )}
              <div className="product-details">
                <LoadAttributes
                  cartItem={cartItem}
                  setActiveImg={setActiveImg}
                  cartStore={cartStore}
                  setCartStore={setCartStore}
                  product={product}
                />
                <QuantityInput
                  cart={cart}
                  product={product}
                  settings={settings}
                  activeConfiguredItems={activeConfiguredItems}
                />
                <ProductSummary
                  cart={cart}
                  product={product}
                  settings={settings}
                />

                <AddToCartButtons
                  cartItem={cartItem}
                  product={product}
                  settings={settings}
                />
                <SellerInfo product={product} />
                <SocialShare product={product} settings={settings} />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductBody;
