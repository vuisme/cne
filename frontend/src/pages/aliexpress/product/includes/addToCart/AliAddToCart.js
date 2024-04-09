import React, { useState } from "react";
import { Link } from "react-router-dom";
import AliProductWishListButton from "../wishlist/AliProductWishListButton";
import { sumCartItemTotal } from "../../../../../utils/AliHelpers";
import Swal from "sweetalert2";
import { useItemMarkAsCart } from "../../../../../api/CartApi";
import { useQueryClient } from "react-query";
import AliPopupShown from "../popup/AliPopupShown";
import { analyticsEventTracker } from "../../../../../utils/AnalyticsHelpers";
import { fbPixelAddToCart } from "../../../../../utils/FacebookPixel";
import { useMediaQuery } from "react-responsive";

const AliAddToCart = (props) => {
  const { cartItem, product, settings } = props;
  const [showPopup, setShowPopup] = useState(false);

  const gaEventTracker = (eventName) => {
    analyticsEventTracker("AliExpress-product-page", eventName);
  };

  const item_id = product?.item?.num_iid;

  const cache = useQueryClient();
  const { mutateAsync, isLoading } = useItemMarkAsCart();

  const aliMinOrder = settings?.ali_min_order_value || 0;
  const currency = settings?.currency_icon || "৳";
  const itemTotal = sumCartItemTotal(cartItem?.variations || []);
  const isExistsOnCart = cartItem?.IsCart || 0;

  const processAddToCart = () => {
    gaEventTracker(`add-to-cart-${item_id}`);
    fbPixelAddToCart(
      cartItem?.Title || "no-product-name",
      parseInt(itemTotal),
      "aliexpress-products"
    );
    mutateAsync(
      { item_id },
      {
        onSuccess: () => {
          setShowPopup(false);
          cache.invalidateQueries("customer_cart");
        },
      }
    );
  };

  const ensurePopupRead = (event) => {
    event.preventDefault();
    if (itemTotal) {
      if (parseInt(itemTotal) >= parseInt(aliMinOrder)) {
        if (cartItem?.shipping_type) {
          setShowPopup(true);
        } else {
          Swal.fire({
            text: `Select your shipping method`,
            icon: "warning",
            confirmButtonText: "Ok, Dismiss",
          });
        }
      } else {
        Swal.fire({
          text: `Minimum product value ${currency} ${aliMinOrder}`,
          icon: "warning",
          confirmButtonText: "Ok, Dismiss",
        });
      }
    } else {
      Swal.fire({
        text: "Add your quantity first",
        icon: "warning",
        confirmButtonText: "Ok, Dismiss",
      });
    }
  };

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  return (
    <>
      {showPopup && !cartItem?.is_popup_shown && (
        <AliPopupShown
          cartItem={cartItem}
          processAddToCart={processAddToCart}
          product_id={item_id}
          setShowPopup={setShowPopup}
          settings={settings}
        />
      )}
      {isMobile ? (
        <nav className="stick_footer_nav stick_add_to_cart_nav ">
          <div className="row">
            <div className="col">
              {isExistsOnCart ? (
                <Link
                  to={`/checkout`}
                  className={`btn btn-custom-product btn-addToCart btn-block`}
                >
                  <span className="cartIcon">
                    <i className="icon-cart" />
                  </span>
                  <span>Buy Now</span>
                </Link>
              ) : (
                <a
                  href={"add-to-cart"}
                  onClick={(event) => ensurePopupRead(event)}
                  className={`btn btn-custom-product btn-addToCart btn-block`}
                >
                  <span className="cartIcon">
                    <i className="icon-cart" />
                  </span>
                  <span>Add to Cart</span>
                </a>
              )}
            </div>
            <div className="col">
              <AliProductWishListButton
                product={product}
                gaEventTracker={gaEventTracker}
                settings={settings}
              />
            </div>
          </div>
        </nav>
      ) : (
        <div className="row">
          <div className="col pr-1">
            {isExistsOnCart ? (
              <Link
                to={`/checkout`}
                className={`btn btn-custom-product btn-addToCart btn-block`}
              >
                <span className="cartIcon">
                  <i className="icon-cart" />
                </span>
                <span>Buy Now</span>
              </Link>
            ) : (
              <a
                href={"add-to-cart"}
                onClick={(event) => ensurePopupRead(event)}
                className={`btn btn-custom-product btn-addToCart btn-block`}
              >
                <span className="cartIcon">
                  <i className="icon-cart" />
                </span>
                <span>Add to Cart</span>
              </a>
            )}
          </div>
          <div className="col pl-1">
            <AliProductWishListButton
              product={product}
              gaEventTracker={gaEventTracker}
              settings={settings}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AliAddToCart;
